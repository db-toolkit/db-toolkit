/**
 * Terminal panel with tabs and modern theme.
 */
import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { X, Minimize2, Maximize2, Plus, Database } from 'lucide-react';
import { WS_ENDPOINTS } from '../../services/websocket';
import '@xterm/xterm/css/xterm.css';

function TerminalPanel({ isOpen, onClose, darkMode }) {
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem('terminal-tabs');
    return saved ? JSON.parse(saved) : [{ id: 1, title: 'Terminal 1' }];
  });
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('terminal-active-tab');
    return saved ? parseInt(saved) : 1;
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const [height, setHeight] = useState(() => {
    const saved = localStorage.getItem('terminal-height');
    return saved ? parseInt(saved) : 384;
  });
  const [isResizing, setIsResizing] = useState(false);
  const terminalsRef = useRef({});
  const containerRefs = useRef({});

  useEffect(() => {
    localStorage.setItem('terminal-tabs', JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem('terminal-active-tab', activeTab.toString());
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('terminal-height', height.toString());
  }, [height]);

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs([...tabs, { id: newId, title: `Terminal ${newId}` }]);
    setActiveTab(newId);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    
    const terminal = terminalsRef.current[id];
    if (terminal) {
      terminal.cleanup?.();
      terminal.term?.dispose();
      delete terminalsRef.current[id];
    }
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    
    // Clean up session storage
    localStorage.removeItem(`terminal-session-${id}`);
    
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    tabs.forEach(tab => {
      if (terminalsRef.current[tab.id]) return;

      const containerRef = containerRefs.current[tab.id];
      if (!containerRef) return;

      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
        scrollback: 10000,
        theme: darkMode ? {
          background: '#0f172a',
          foreground: '#e2e8f0',
          cursor: '#06b6d4',
          cursorAccent: '#0f172a',
          black: '#1e293b',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#cbd5e1',
          brightBlack: '#475569',
          brightRed: '#f87171',
          brightGreen: '#34d399',
          brightYellow: '#fbbf24',
          brightBlue: '#60a5fa',
          brightMagenta: '#c084fc',
          brightCyan: '#22d3ee',
          brightWhite: '#f1f5f9',
        } : {
          background: '#ffffff',
          foreground: '#1e293b',
          cursor: '#0891b2',
          cursorAccent: '#ffffff',
          black: '#1e293b',
          red: '#dc2626',
          green: '#059669',
          yellow: '#d97706',
          blue: '#2563eb',
          magenta: '#9333ea',
          cyan: '#0891b2',
          white: '#475569',
          brightBlack: '#64748b',
          brightRed: '#ef4444',
          brightGreen: '#10b981',
          brightYellow: '#f59e0b',
          brightBlue: '#3b82f6',
          brightMagenta: '#a855f7',
          brightCyan: '#06b6d4',
          brightWhite: '#0f172a',
        },
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(containerRef);
      
      setTimeout(() => {
        fit.fit();
        if (tab.id === activeTab) {
          term.focus();
        }
      }, 50);

      let ws = null;
      let reconnectAttempts = 0;
      let reconnectTimeout = null;
      let currentDir = '';
      let isManualClose = false;

      const connect = () => {
        ws = new WebSocket(WS_ENDPOINTS.TERMINAL);

        ws.onopen = () => {
          reconnectAttempts = 0;
          ws.send(JSON.stringify({ session_id: `tab-${tab.id}` }));
        };

        ws.onmessage = (event) => {
          if (event.data instanceof Blob) {
            event.data.arrayBuffer().then((buffer) => {
              term.write(new Uint8Array(buffer));
            });
          } else {
            term.write(event.data);
          }
        };

        ws.onerror = () => {
          // Silent error handling
        };

        ws.onclose = () => {
          if (isManualClose) return;
          
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          
          reconnectTimeout = setTimeout(() => {
            if (!isManualClose) {
              connect();
            }
          }, delay);
        };
      };

      connect();

      term.onData((data) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
        term.scrollToBottom();
      });

      term.onResize(({ rows, cols }) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(`RESIZE:${rows}:${cols}`);
        }
      });

      terminalsRef.current[tab.id] = { 
        term, 
        fit, 
        ws, 
        cleanup: () => {
          isManualClose = true;
          if (reconnectTimeout) clearTimeout(reconnectTimeout);
          if (ws) ws.close();
        }
      };
    });

    const handleWindowResize = () => {
      Object.values(terminalsRef.current).forEach(({ fit }) => {
        fit?.fit();
      });
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isOpen, tabs, activeTab]);

  useEffect(() => {
    if (isOpen && terminalsRef.current[activeTab]) {
      const { fit, term } = terminalsRef.current[activeTab];
      const timer = setTimeout(() => {
        fit?.fit();
        term?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [height, isMaximized, isOpen, activeTab]);

  useEffect(() => {
    return () => {
      Object.values(terminalsRef.current).forEach(({ term, cleanup }) => {
        cleanup?.();
        term?.dispose();
      });
      terminalsRef.current = {};
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      setHeight(Math.max(200, Math.min(newHeight, window.innerHeight - 100)));
      
      // Fit terminal on resize
      Object.values(terminalsRef.current).forEach(({ fit }) => {
        fit?.fit();
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 shadow-2xl border-t ${
        darkMode 
          ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/20' 
          : 'bg-gradient-to-b from-gray-50 to-gray-100 border-cyan-600/30'
      }`}
      style={{ height: isMaximized ? '100vh' : `${height}px` }}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 left-0 right-0 h-1 cursor-ns-resize transition-colors ${
          darkMode ? 'hover:bg-cyan-500' : 'hover:bg-cyan-600'
        }`}
      />
      
      <div className={`flex items-center justify-between px-4 py-2 backdrop-blur-sm border-b ${
        darkMode 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white/50 border-gray-300/50'
      }`}>
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          <div className={`flex items-center gap-1 border-r pr-3 ${
            darkMode ? 'border-slate-700' : 'border-gray-300'
          }`}>
            <button
              onClick={() => {
                const ws = terminalsRef.current[activeTab]?.ws;
                if (ws && ws.readyState === WebSocket.OPEN) {
                  const conn = JSON.parse(localStorage.getItem('last-connection') || '{}');
                  if (conn.type === 'postgresql') {
                    const cmd = `psql -h ${conn.host || 'localhost'} -p ${conn.port || 5432} -U ${conn.username || 'postgres'} -d ${conn.database || 'postgres'}\r`;
                    ws.send(cmd);
                  } else {
                    ws.send('psql\r');
                  }
                }
              }}
              className={`px-2 py-1 text-xs rounded transition-all flex items-center gap-1 ${
                darkMode 
                  ? 'bg-slate-700/50 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:text-cyan-600 hover:bg-gray-300'
              }`}
              title="PostgreSQL CLI"
            >
              <Database size={12} />
              psql
            </button>
            <button
              onClick={() => {
                const ws = terminalsRef.current[activeTab]?.ws;
                if (ws && ws.readyState === WebSocket.OPEN) {
                  const conn = JSON.parse(localStorage.getItem('last-connection') || '{}');
                  if (conn.type === 'mysql') {
                    const cmd = `mysql -h ${conn.host || 'localhost'} -P ${conn.port || 3306} -u ${conn.username || 'root'} -p ${conn.database || ''}\r`;
                    ws.send(cmd);
                  } else {
                    ws.send('mysql\r');
                  }
                }
              }}
              className={`px-2 py-1 text-xs rounded transition-all flex items-center gap-1 ${
                darkMode 
                  ? 'bg-slate-700/50 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:text-cyan-600 hover:bg-gray-300'
              }`}
              title="MySQL CLI"
            >
              <Database size={12} />
              mysql
            </button>
            <button
              onClick={() => {
                const ws = terminalsRef.current[activeTab]?.ws;
                if (ws && ws.readyState === WebSocket.OPEN) {
                  const conn = JSON.parse(localStorage.getItem('last-connection') || '{}');
                  if (conn.type === 'mongodb') {
                    const cmd = `mongosh "mongodb://${conn.username || ''}${conn.username ? ':' + (conn.password || '') + '@' : ''}${conn.host || 'localhost'}:${conn.port || 27017}/${conn.database || 'test'}"\r`;
                    ws.send(cmd);
                  } else {
                    ws.send('mongo\r');
                  }
                }
              }}
              className={`px-2 py-1 text-xs rounded transition-all flex items-center gap-1 ${
                darkMode 
                  ? 'bg-slate-700/50 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:text-cyan-600 hover:bg-gray-300'
              }`}
              title="MongoDB CLI"
            >
              <Database size={12} />
              mongo
            </button>
          </div>
          <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-all ${
                activeTab === tab.id
                  ? darkMode 
                    ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                    : 'bg-white text-cyan-600 border-t-2 border-cyan-600'
                  : darkMode
                    ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-xs font-medium whitespace-nowrap">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTab}
            className={`p-1.5 rounded-lg transition-all ${
              darkMode
                ? 'bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800'
                : 'bg-gray-200 text-gray-600 hover:text-cyan-600 hover:bg-gray-300'
            }`}
            title="New Terminal"
          >
            <Plus size={14} />
          </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className={`p-1.5 rounded transition-all ${
              darkMode
                ? 'hover:bg-slate-700 text-slate-400 hover:text-cyan-400'
                : 'hover:bg-gray-200 text-gray-600 hover:text-cyan-600'
            }`}
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded transition-all ${
              darkMode
                ? 'hover:bg-slate-700 text-slate-400 hover:text-red-400'
                : 'hover:bg-gray-200 text-gray-600 hover:text-red-500'
            }`}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="relative w-full h-full" style={{ height: isMaximized ? 'calc(100vh - 48px)' : `${height - 48}px` }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`absolute inset-0 ${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            <div
              ref={el => containerRefs.current[tab.id] = el}
              className="w-full h-full p-3"
              onClick={() => terminalsRef.current[tab.id]?.term?.focus()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminalPanel;
