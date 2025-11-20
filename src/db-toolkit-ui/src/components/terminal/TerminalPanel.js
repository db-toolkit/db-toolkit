/**
 * Terminal panel with xterm.js integration.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { useTerminal } from '../../hooks/useTerminal';
import 'xterm/css/xterm.css';

function TerminalPanel({ isOpen, onClose }) {
  const terminalRef = useRef(null);
  const containerRef = useRef(null);
  const termRef = useRef(null);
  const [fitAddon, setFitAddon] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [height, setHeight] = useState(384);
  const [isResizing, setIsResizing] = useState(false);

  const handleData = useCallback((data, type) => {
    if (termRef.current && type === 'data') {
      termRef.current.write(data);
    }
  }, []);

  const { sendData, isConnected } = useTerminal(handleData);

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

    termRef.current = term;
    setFitAddon(fit);

    term.onData((data) => {
      sendData(data);
    });

    term.onResize(({ rows, cols }) => {
      sendData(`RESIZE:${rows}:${cols}`);
    });

    return () => {
      term.dispose();
      termRef.current = null;
      setFitAddon(null);
    };
  }, [isOpen, sendData]);

  useEffect(() => {
    if (!fitAddon) return;

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitAddon]);

  useEffect(() => {
    if (fitAddon && isOpen && termRef.current) {
      const timer = setTimeout(() => {
        fitAddon.fit();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [height, isMaximized, fitAddon, isOpen]);

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
        onClick={() => termRef.current?.focus()}
      />
    </div>
  );
}

export default TerminalPanel;
