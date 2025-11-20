/**
 * Terminal panel with xterm.js integration.
 */
import { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import 'xterm/css/xterm.css';

function TerminalPanel({ isOpen, onClose }) {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const [terminal, setTerminal] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);
  const [ws, setWs] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [height, setHeight] = useState(384);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#e5e5e5',
      },
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);
    fit.fit();

    setTerminal(term);
    setFitAddon(fit);

    const websocket = new WebSocket('ws://localhost:8000/ws/terminal');

    websocket.onopen = () => {
      term.writeln('Terminal connected. Type commands below:\r\n');
    };

    websocket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        event.data.arrayBuffer().then((buffer) => {
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
      term.writeln('\r\n\x1b[33mTerminal disconnected\x1b[0m\r\n');
    };

    term.onData((data) => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(data);
      }
    });

    setWs(websocket);

    return () => {
      term.dispose();
      websocket.close();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!fitAddon || !terminal) return;

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitAddon, terminal]);

  useEffect(() => {
    if (fitAddon && terminal && isOpen) {
      setTimeout(() => fitAddon.fit(), 100);
    }
  }, [height, isMaximized, fitAddon, terminal, isOpen]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newHeight = window.innerHeight - e.clientY;
      setHeight(Math.max(200, Math.min(newHeight, window.innerHeight - 100)));
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
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40"
      style={{ height: isMaximized ? '100vh' : `${height}px` }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-500 transition-colors"
      />
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm text-white font-medium">Terminal</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div
        ref={terminalRef}
        className="w-full h-full p-2"
        style={{ height: isMaximized ? 'calc(100vh - 40px)' : `${height - 40}px` }}
      />
    </div>
  );
}

export default TerminalPanel;
