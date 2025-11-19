"""WebSocket handler for terminal sessions."""
import asyncio
import os
import pty
import select
import struct
import fcntl
import termios
from fastapi import WebSocket, WebSocketDisconnect


async def websocket_terminal(websocket: WebSocket):
    """Handle terminal WebSocket connection."""
    await websocket.accept()
    
    # Create pseudo-terminal
    master_fd, slave_fd = pty.openpty()
    
    # Start shell process
    shell = os.environ.get('SHELL', '/bin/bash')
    pid = os.fork()
    
    if pid == 0:
        # Child process
        os.close(master_fd)
        os.setsid()
        os.dup2(slave_fd, 0)
        os.dup2(slave_fd, 1)
        os.dup2(slave_fd, 2)
        os.close(slave_fd)
        os.execv(shell, [shell])
    else:
        # Parent process
        os.close(slave_fd)
        
        async def read_output():
            """Read from terminal and send to WebSocket."""
            while True:
                try:
                    r, _, _ = select.select([master_fd], [], [], 0.1)
                    if r:
                        data = os.read(master_fd, 1024)
                        if data:
                            await websocket.send_bytes(data)
                        else:
                            break
                    await asyncio.sleep(0.01)
                except Exception:
                    break
        
        async def write_input():
            """Receive from WebSocket and write to terminal."""
            try:
                while True:
                    data = await websocket.receive()
                    if 'bytes' in data:
                        os.write(master_fd, data['bytes'])
                    elif 'text' in data:
                        os.write(master_fd, data['text'].encode())
            except WebSocketDisconnect:
                pass
        
        try:
            await asyncio.gather(read_output(), write_input())
        finally:
            os.close(master_fd)
            os.kill(pid, 9)
            os.waitpid(pid, 0)
