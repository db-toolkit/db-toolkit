import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { EditorView, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql, SQLDialect } from '@codemirror/lang-sql';
import { autocompletion } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { Button } from '../common/Button';

export function QueryEditor({ query, onChange, onExecute, loading, schema }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const tables = {};
    if (schema) {
      Object.entries(schema).forEach(([schemaName, schemaData]) => {
        schemaData.tables?.forEach(table => {
          tables[table.name] = table.columns?.map(col => col.name) || [];
        });
      });
    }

    const dialect = SQLDialect.define({
      keywords: 'select from where join inner left right outer on and or not in like between order by group having limit offset insert update delete create alter drop table index',
    });

    const startState = EditorState.create({
      doc: query,
      extensions: [
        sql({ dialect, schema: tables }),
        autocompletion(),
        keymap.of([
          ...defaultKeymap,
          { key: 'Ctrl-Enter', run: () => { onExecute(); return true; } },
          { key: 'Cmd-Enter', run: () => { onExecute(); return true; } },
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': { height: '200px' },
          '.cm-scroller': { overflow: 'auto' },
          '.cm-content': { fontFamily: 'monospace', fontSize: '14px' },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [schema]);

  useEffect(() => {
    if (viewRef.current && query !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: query },
      });
    }
  }, [query]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">SQL Editor</h3>
        <Button
          size="sm"
          icon={<Play size={16} />}
          onClick={onExecute}
          disabled={loading || !query.trim()}
          loading={loading}
        >
          Execute (Ctrl+Enter)
        </Button>
      </div>
      <div
        ref={editorRef}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      />
    </div>
  );
}
