"""Analytics routes for database monitoring."""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from operations.analytics_manager import AnalyticsManager
from operations.connection_manager import ConnectionManager

router = APIRouter()
connection_manager = ConnectionManager()


class KillQueryRequest(BaseModel):
    """Kill query request."""
    pid: int


class QueryPlanRequest(BaseModel):
    """Query plan request."""
    query: str


@router.get("/connections/{connection_id}")
async def get_analytics(connection_id: int):
    """Get database analytics."""
    try:
        connection_info = connection_manager.get_connection(connection_id)
        if not connection_info:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        config, connector = connection_info
        analytics_manager = AnalyticsManager(connector.connection)
        result = await analytics_manager.get_analytics(config, connection_id)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/connections/{connection_id}/history")
async def get_historical_data(connection_id: int, hours: int = Query(default=3, ge=1, le=3)):
    """Get historical analytics data."""
    try:
        connection_info = connection_manager.get_connection(connection_id)
        if not connection_info:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        config, connector = connection_info
        analytics_manager = AnalyticsManager(connector.connection)
        history = analytics_manager.get_historical_data(connection_id, hours)
        
        return {"success": True, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/connections/{connection_id}/query-plan")
async def get_query_plan(connection_id: int, request: QueryPlanRequest):
    """Get query execution plan."""
    try:
        connection_info = connection_manager.get_connection(connection_id)
        if not connection_info:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        config, connector = connection_info
        analytics_manager = AnalyticsManager(connector.connection)
        result = await analytics_manager.get_query_plan(request.query, config)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/connections/{connection_id}/kill")
async def kill_query(connection_id: int, request: KillQueryRequest):
    """Kill a running query."""
    try:
        connection_info = connection_manager.get_connection(connection_id)
        if not connection_info:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        config, connector = connection_info
        analytics_manager = AnalyticsManager(connector.connection)
        result = await analytics_manager.kill_query(request.pid, config)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
