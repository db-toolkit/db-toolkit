"""Migrator CLI command executor."""
import subprocess
from typing import Dict, Any


class MigratorExecutor:
    """Execute migrator CLI commands."""

    @staticmethod
    async def execute_command(command: str, timeout: int = 30) -> Dict[str, Any]:
        """Execute migrator command and return result."""
        try:
            migrator_cmd = ["migrator"] + command.split()
            
            result = subprocess.run(
                migrator_cmd,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "exit_code": result.returncode
            }
        except subprocess.TimeoutExpired:
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

    @staticmethod
    async def get_version() -> Dict[str, Any]:
        """Get migrator CLI version."""
        try:
            result = subprocess.run(
                ["migrator", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            return {
                "version": result.stdout.strip(),
                "installed": result.returncode == 0
            }
        except Exception:
            return {"version": None, "installed": False}
