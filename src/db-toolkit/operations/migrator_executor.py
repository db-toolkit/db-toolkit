"""Migrator CLI command executor."""
import asyncio
import shutil
from typing import Dict, Any, Optional


class MigratorExecutor:
    """Execute migrator CLI commands."""
    
    _migrator_path: Optional[str] = None
    
    @classmethod
    def get_migrator_path(cls) -> str:
        """Get cached migrator binary path."""
        if cls._migrator_path is None:
            cls._migrator_path = shutil.which("migrator")
            if cls._migrator_path is None:
                raise FileNotFoundError("migrator binary not found in PATH")
        return cls._migrator_path

    @classmethod
    async def execute_command(cls, command: str, timeout: int = 10) -> Dict[str, Any]:
        """Execute migrator command and return result."""
        try:
            migrator_path = cls.get_migrator_path()
            migrator_cmd = [migrator_path] + command.split()
            
            process = await asyncio.create_subprocess_exec(
                *migrator_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=timeout
                )
                
                return {
                    "success": process.returncode == 0,
                    "output": stdout.decode(),
                    "error": stderr.decode(),
                    "exit_code": process.returncode
                }
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()
                return {
                    "success": False,
                    "output": "",
                    "error": "Command timed out",
                    "exit_code": -1
                }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": str(e),
                "exit_code": -1
            }

    @classmethod
    async def execute_command_stream(cls, command: str, websocket):
        """Execute migrator command and stream output via WebSocket."""
        try:
            migrator_path = cls.get_migrator_path()
            migrator_cmd = [migrator_path] + command.split()
            
            process = await asyncio.create_subprocess_exec(
                *migrator_cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            async def read_stream(stream, stream_type):
                while True:
                    line = await stream.readline()
                    if not line:
                        break
                    await websocket.send_json({
                        "type": stream_type,
                        "data": line.decode().rstrip()
                    })
            
            await asyncio.gather(
                read_stream(process.stdout, "stdout"),
                read_stream(process.stderr, "stderr")
            )
            
            await process.wait()
            
            await websocket.send_json({
                "type": "exit",
                "code": process.returncode,
                "success": process.returncode == 0
            })
        except Exception as e:
            await websocket.send_json({
                "type": "error",
                "data": str(e)
            })

    @classmethod
    async def get_version(cls) -> Dict[str, Any]:
        """Get migrator CLI version."""
        try:
            migrator_path = cls.get_migrator_path()
            process = await asyncio.create_subprocess_exec(
                migrator_path, "--version",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, _ = await asyncio.wait_for(process.communicate(), timeout=3)
            
            return {
                "version": stdout.decode().strip(),
                "installed": process.returncode == 0
            }
        except Exception:
            return {"version": None, "installed": False}
