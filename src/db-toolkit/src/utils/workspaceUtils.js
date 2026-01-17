/**
 * Workspace creation utility
 */

export const createWorkspaceWithEffect = async (createWorkspace, navigate, workspaces) => {
  try {
    const newWorkspace = await createWorkspace(null, `Workspace ${workspaces.length + 1}`, null);
    
    if (newWorkspace) {
      navigate('/');
      return newWorkspace;
    }
    return null;
  } catch (error) {
    console.error('Failed to create workspace:', error);
    return null;
  }
};

export const switchWorkspaceWithEffect = async (workspaceId, switchWorkspace) => {
  try {
    await switchWorkspace(workspaceId);
  } catch (error) {
    console.error('Failed to switch workspace:', error);
  }
};