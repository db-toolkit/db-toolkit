"""Query execution routes."""

import json
from fastapi import APIRouter, HTTPException
from core.storage import ConnectionStorage
from core.schemas import QueryRequest, QueryResponse
from operations.query_executor import QueryExecutor
from operations.query_history import QueryHistory
from operations.explain_analyzer import ExplainAnalyzer

router = APIRouter()
storage = ConnectionStorage()
executor = QueryExecutor()
history = QueryHistory()
analyzer = ExplainAnalyzer()


@router.post("/connections/{connection_id}/query", response_model=QueryResponse)
async def execute_query(connection_id: str, request: QueryRequest):
    """Execute query on connection."""
    from operations.operation_lock import operation_lock

    connection = await storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    if operation_lock.is_locked(connection_id):
        raise HTTPException(
            status_code=409, detail="Connection is busy with another operation"
        )

    lock = operation_lock.get_lock(connection_id)
    async with lock:
        result = await executor.execute_query(
            connection=connection,
            query=request.query,
            limit=request.limit,
            offset=request.offset,
            timeout=request.timeout,
        )
    
        # Save to history
        history.add_query(
            connection_id=connection_id,
            query=request.query,
            success=result["success"],
            execution_time=result["execution_time"],
            row_count=result["total_rows"],
            error=result.get("error"),
        )

        return QueryResponse(**result)


@router.get("/connections/{connection_id}/query/history")
async def get_query_history(connection_id: str, limit: int = 50):
    """Get query history for connection."""
    connection = await storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    queries = history.get_history(connection_id, limit)
    return {"success": True, "history": queries, "count": len(queries)}


@router.delete("/connections/{connection_id}/query/history")
async def clear_query_history(connection_id: str):
    """Clear query history for connection."""
    connection = await storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    success = history.clear_history(connection_id)
    return {"success": success, "message": "History cleared" if success else "No history found"}


@router.get("/connections/{connection_id}/query/history/search")
async def search_query_history(connection_id: str, q: str):
    """Search query history."""
    connection = await storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    results = history.search_history(connection_id, q)
    return {"success": True, "results": results, "count": len(results)}


@router.post("/query/history/cleanup")
async def cleanup_query_history(retention_days: int = 30):
    """Cleanup old query history based on retention days."""
    removed = history.cleanup_old_history(retention_days)
    return {"success": True, "removed_count": removed, "message": f"Removed {removed} old queries"}


@router.post("/connections/{connection_id}/query/explain")
async def explain_query(connection_id: str, request: QueryRequest):
    """Get query execution plan with AI analysis."""
    from operations.operation_lock import operation_lock

    connection = await storage.get_connection(connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    if operation_lock.is_locked(connection_id):
        raise HTTPException(
            status_code=409, detail="Connection is busy with another operation"
        )

    lock = operation_lock.get_lock(connection_id)
    async with lock:
        # Execute EXPLAIN query
        explain_query_text = f"EXPLAIN (FORMAT JSON, ANALYZE, BUFFERS) {request.query}"
        result = await executor.execute_query(
            connection=connection,
            query=explain_query_text,
            limit=1000,
            offset=0,
            timeout=request.timeout,
        )
        
        if not result["success"]:
            return {"success": False, "error": result.get("error")}
        
        # Get explain output
        explain_output = result["rows"][0][0] if result["rows"] else "{}"
        
        # Analyze with Gemini
        analysis = await analyzer.analyze_explain(request.query, json.dumps(explain_output, indent=2))
        
        return {
            "success": True,
            "explain_plan": explain_output,
            "analysis": analysis.get("analysis") if analysis["success"] else None,
            "error": analysis.get("error") if not analysis["success"] else None
        }