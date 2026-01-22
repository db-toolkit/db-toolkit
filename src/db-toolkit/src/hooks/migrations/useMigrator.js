import { useState } from 'react';
import { migratorAPI } from '../services/api';

export function useMigrator() {
  const [isRunning, setIsRunning] = useState(false);

  const executeCommand = async (command) => {
    setIsRunning(true);
    try {
      const response = await migratorAPI.execute(command);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to execute command: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getVersion = async () => {
    try {
      const response = await migratorAPI.getVersion();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get version: ${error.message}`);
    }
  };

  return { executeCommand, getVersion, isRunning };
}
