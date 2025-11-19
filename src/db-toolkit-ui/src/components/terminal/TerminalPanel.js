/**
 * Terminal panel component with xterm.js.
 */
import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import '@xterm/xterm/css/xterm.css';

function TerminalPanel({ isOpen, onClose }) {
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(null);
  const ws = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!isOpen || !terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4'
      }
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    fitAddon.current = fit;

    term.open(terminalRef.current);
    fit.fit();
    terminalInstance.current = term;

    const websocket = new WebSocket('ws://localhost:8000/ws/terminal');
    ws.current = websocket;

    websocket.onopen = () => {
      term.writeln('Connected to terminal...\r\n');
    };

    websocket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(buffer => {
          term.write(new Uint8Array(buffer));
        });
      } else {
        term.write(event.data);
      }
    };

    websocket.onerror = () => {
      term.writeln('\r\n\x1b[31mWebSocket connection error\x1b[0m\r\n');
    };

    websocket.onclose = () => {
      term.writeln('\r\n\x1b[33mConnection closed\x1b[0m\r\n');
    };

    term.onData((data) => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(data);
      }
    });

    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
      term.dispose();
    };
  }, [isOpen]);

  useEffect(() => {
    if (fitAddon.current && isOpen) {
      setTimeout(() => fitAddon.current.fit(), 100);
    }
  }, [isMaximized, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40 transition-all ${
        isMaximized ? 'h-screen' : 'h-80'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-gray-300 font-medium">Terminal</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div ref={terminalRef} className="h-full p-2" />
    </div>
  );
}

export default TerminalPanel;
