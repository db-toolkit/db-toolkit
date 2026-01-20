/**
 * Hook for query auto-fix with AI
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useAiAssistant } from "./useAiAssistant";

export function useQueryAutoFix(connectionId, query, error, schema, toast) {
  const { fixQueryError } = useAiAssistant(connectionId);
  const [fixSuggestion, setFixSuggestion] = useState(null);
  const [isFixingError, setIsFixingError] = useState(false);
  const isFixingRef = useRef(false);

  const buildSchemaContext = useCallback(() => {
    const tables = {};
    if (!schema) return tables;

    const normalizeColumns = (cols) =>
      (cols || []).map((col) => ({
        name: col.name || col.column_name,
        type: col.type || col.data_type,
      }));

    if (schema.schemas) {
      Object.values(schema.schemas).forEach((s) => {
        if (s.tables) {
          Object.entries(s.tables).forEach(([tableName, tableDef]) => {
            tables[tableName] = {
              columns: normalizeColumns(tableDef.columns || []),
            };
          });
        }
      });
    } else if (schema.tables) {
      Object.entries(schema.tables).forEach(([tableName, tableDef]) => {
        tables[tableName] = {
          columns: normalizeColumns(tableDef.columns || []),
        };
      });
    } else {
      // Fallback: if schema looks like a table map directly
      Object.entries(schema || {}).forEach(([tableName, tableDef]) => {
        if (tableDef?.columns) {
          tables[tableName] = {
            columns: normalizeColumns(tableDef.columns),
          };
        }
      });
    }

    return tables;
  }, [schema]);

  // Auto-fix effect
  useEffect(() => {
    const triggerAutoFix = async () => {
      if (!error || !query || fixSuggestion || isFixingRef.current) return;

      isFixingRef.current = true;
      setIsFixingError(true);
      try {
        console.log("Auto-fix effect triggered for error:", error);
        toast.info("Attempting to auto-fix query error...");

        const tables = buildSchemaContext();

        const fixResult = await fixQueryError(query, error, tables);

        if (fixResult && fixResult.fixed_query) {
          console.log("AI Auto-Fix success:", fixResult);
          toast.success("AI found a fix!");
          setFixSuggestion({
            original: query,
            fixed: fixResult.fixed_query,
            explanation: fixResult.explanation,
          });
        } else {
          console.warn("AI Auto-Fix returned no fixed query");
          toast.error("AI could not find a fix.");
        }
      } catch (aiErr) {
        console.error("Auto-fix failed:", aiErr);
        toast.error(`Auto-fix failed: ${aiErr.message}`);
      } finally {
        isFixingRef.current = false;
        setIsFixingError(false);
      }
    };

    triggerAutoFix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, query]); // Removed schema to prevent loops, added isFixing check

  const handleAcceptFix = useCallback(
    (setQuery) => {
      if (fixSuggestion) {
        setQuery(fixSuggestion.fixed);
        setFixSuggestion(null);
      }
    },
    [fixSuggestion],
  );

  const handleRejectFix = useCallback(() => {
    setFixSuggestion(null);
  }, []);

  const clearFixSuggestion = useCallback(() => {
    setFixSuggestion(null);
  }, []);

  return {
    fixSuggestion,
    isFixingError,
    handleAcceptFix,
    handleRejectFix,
    clearFixSuggestion,
  };
}
