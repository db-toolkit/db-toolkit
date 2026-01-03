/**
 * Workspace creation utility with visual feedback
 */

export const createWorkspaceWithEffect = async (createWorkspace, navigate, workspaces) => {
  try {
    // Create the new workspace
    const newWorkspace = await createWorkspace(null, `Workspace ${workspaces.length + 1}`, null);
    
    if (newWorkspace) {
      // Add blink effect to the whole page
      document.body.classList.add('workspace-transition-blink');
      
      // Navigate to the new workspace
      navigate('/');
      
      // Remove blink effect after animation completes
      setTimeout(() => {
        document.body.classList.remove('workspace-transition-blink');
      }, 150);
      
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
    // Add blink effect
    document.body.classList.add('workspace-transition-blink');
    
    // Switch workspace
    await switchWorkspace(workspaceId);
    
    // Remove blink effect after animation
    setTimeout(() => {
      document.body.classList.remove('workspace-transition-blink');
    }, 150);
  } catch (error) {
    console.error('Failed to switch workspace:', error);
  }
};