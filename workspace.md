# Workspace Tabs Implementation Guide

## Overview

This document outlines the implementation of workspace tabs functionality, allowing users to work with multiple database connections simultaneously with isolated state per workspace.

## Feature Description

Workspace tabs enable users to:
- Open multiple database connections in separate tabs
- Switch between workspaces without losing context
- Maintain isolated state (queries, results, history) per workspace
- Persist workspace sessions across app restarts

## Architecture Changes

### State Management

**Current State**
- Single global connection context
- Shared query history and results
- Single active connection at a time

**New State Structure**
- Array of workspace objects, each containing:
  - Unique workspace ID
  - Connection ID
  - Connection metadata (name, type, color)
  - Active page/route within workspace
  - Workspace-specific state (query tabs, results, history)
  - Last accessed timestamp

### Component Hierarchy

**New Components**
- WorkspaceTabBar: Top-level tab bar component
- WorkspaceTab: Individual tab with connection info and close button
- WorkspaceProvider: Context provider for workspace state management

**Modified Components**
- Layout: Add WorkspaceTabBar above main content
- App: Wrap routes with WorkspaceProvider
- All page components: Access workspace context instead of global connection

## Implementation Phases

### Phase 1: Core Workspace Management

**1.1 Create Workspace Context**
- Define workspace data structure
- Implement workspace CRUD operations (create, read, update, delete)
- Add active workspace tracking
- Implement workspace switching logic

**1.2 Build WorkspaceTabBar Component**
- Render tabs for each active workspace
- Display connection name and database type icon
- Add close button with confirmation for unsaved changes
- Implement tab click to switch workspaces
- Add "New Workspace" button to open connection selector

**1.3 Integrate with Layout**
- Position WorkspaceTabBar below header, above main content
- Adjust layout flex structure to accommodate tab bar
- Ensure proper spacing and responsive behavior

**1.4 Update Routing Logic**
- Modify routes to include workspace ID parameter
- Update navigation to preserve workspace context
- Handle workspace-specific URLs (e.g., /workspace/:workspaceId/query/:connectionId)

### Phase 2: Isolated State Management

**2.1 Workspace-Specific Query State**
- Store query editor tabs per workspace
- Maintain separate query history per workspace
- Isolate query results and execution state
- Preserve unsaved queries when switching workspaces

**2.2 Workspace-Specific Schema Cache**
- Cache schema data per workspace
- Implement workspace-aware cache invalidation
- Share schema cache for same connection across workspaces (optimization)

**2.3 Workspace-Specific Navigation State**
- Remember active page per workspace (Query, Schema, Data Explorer)
- Restore navigation state when switching back to workspace
- Preserve scroll positions and UI state

### Phase 3: Persistence and Session Management

**3.1 LocalStorage Persistence**
- Save workspace array to localStorage on changes
- Implement debounced save to prevent excessive writes
- Store workspace metadata and state references

**3.2 IndexedDB for Large Data**
- Store query results and large datasets in IndexedDB
- Implement workspace-keyed storage
- Add cleanup for closed workspaces

**3.3 Session Restoration**
- Load workspaces on app startup
- Restore active workspace
- Lazy-load workspace data as needed
- Handle missing connections gracefully

### Phase 4: Enhanced UX Features

**4.1 Visual Differentiation**
- Add color coding for workspaces (user-selectable or auto-assigned)
- Display database type icons (PostgreSQL, MySQL, SQLite)
- Show connection status indicator (connected, disconnected, error)
- Add visual feedback for active workspace

**4.2 Keyboard Shortcuts**
- Implement Cmd/Ctrl + 1-9 to switch to workspace by position
- Add Cmd/Ctrl + W to close active workspace
- Implement Cmd/Ctrl + T to open new workspace

**4.3 Unsaved Changes Protection**
- Track unsaved queries per workspace
- Show warning before closing workspace with unsaved changes
- Add visual indicator (dot or asterisk) on tab for unsaved changes

**4.4 Tab Management**
- Implement drag-and-drop to reorder tabs
- Add right-click context menu (Close, Close Others, Close All)
- Show tooltip with full connection details on hover
- Limit maximum workspaces (e.g., 10) with user notification

### Phase 5: Custom Titlebar Integration

**5.1 Electron Configuration**
- Set frame: false in BrowserWindow options
- Configure transparent titlebar for macOS
- Set proper window dimensions and constraints

**5.2 Custom Window Controls**
- Implement macOS traffic light buttons (close, minimize, maximize)
- Implement Windows window controls (minimize, maximize, close)
- Add platform detection for conditional rendering
- Implement window drag region

**5.3 Titlebar Component**
- Create CustomTitleBar component combining workspace tabs and window controls
- Position workspace tabs in center of titlebar
- Place notifications and settings icons on right side
- Add app icon or menu on left side (Windows/Linux)

**5.4 Layout Refactoring**
- Remove existing header from Layout component
- Integrate CustomTitleBar at app root level
- Adjust main content area to account for titlebar height
- Ensure proper z-index layering

**5.5 Responsive Behavior**
- Handle tab overflow with horizontal scroll or dropdown
- Collapse tab text on narrow windows
- Ensure window controls always visible and functional
- Test on different screen sizes and resolutions

## Folder Structure

### Backend Structure
- Create workspace operations folder: `src/db-toolkit/electron/backend/operations/workspace/`
  - workspace-manager.js: Core workspace management logic
  - workspace-storage.js: Persistence layer for workspace data
- Create workspace IPC handler: `src/db-toolkit/electron/backend/handlers/workspace.js`
  - Handle workspace CRUD operations
  - Manage workspace state synchronization

### Frontend Structure
- Create workspace components folder: `src/db-toolkit/src/components/workspace/`
  - WorkspaceTabBar.js: Main tab bar component
  - WorkspaceTab.js: Individual tab component
  - WorkspaceProvider.js: Context provider
  - CustomTitleBar.js: Custom titlebar with workspace tabs (Phase 5)
  - WindowControls.js: Platform-specific window controls (Phase 5)

## Data Structures

### Workspace Object
- id: Unique identifier (UUID)
- connectionId: Reference to database connection
- connectionName: Display name
- connectionType: Database type (postgres, mysql, sqlite)
- color: Hex color code for visual identification
- createdAt: Timestamp
- lastAccessedAt: Timestamp
- state: Object containing workspace-specific state
  - activeRoute: Current page path
  - queryTabs: Array of query editor tabs
  - queryHistory: Array of executed queries
  - scrollPositions: Object mapping routes to scroll positions
  - expandedNodes: Schema tree expansion state

### WorkspaceContext API
- workspaces: Array of workspace objects
- activeWorkspaceId: Currently active workspace ID
- createWorkspace(connectionId): Create new workspace
- closeWorkspace(workspaceId): Close workspace
- switchWorkspace(workspaceId): Switch to workspace
- updateWorkspaceState(workspaceId, state): Update workspace state
- getWorkspaceState(workspaceId): Get workspace state

## Migration Strategy

### Backward Compatibility
- Detect existing single-connection usage
- Auto-create workspace for current connection on first load
- Migrate existing query history to first workspace
- Preserve all existing functionality

### Gradual Rollout
- Phase 1: Release with basic workspace management
- Phase 2: Add persistence and session management
- Phase 3: Add enhanced UX features
- Gather user feedback between phases

## Testing Strategy

### Unit Tests
- Workspace CRUD operations
- State isolation between workspaces
- Persistence and restoration logic
- Context switching behavior

### Integration Tests
- Multi-workspace navigation flows
- State preservation across switches
- Session restoration on app restart
- Connection error handling per workspace

### User Acceptance Testing
- Test with multiple database types
- Verify state isolation
- Test performance with maximum workspaces
- Validate keyboard shortcuts

## Performance Considerations

### Memory Management
- Implement lazy loading for inactive workspaces
- Clear cached data for closed workspaces
- Set maximum workspace limit
- Monitor memory usage with multiple active workspaces

### Optimization Strategies
- Share schema cache for same connection
- Debounce state persistence
- Use virtual scrolling for large result sets
- Implement workspace data cleanup on close

## UI/UX Specifications

### Tab Bar Design
- Height: 40px
- Background: White (light mode), Gray-800 (dark mode)
- Border: Bottom border matching app theme
- Tab width: Auto with max-width of 200px
- Tab overflow: Horizontal scroll if needed

### Tab States
- Active: Green accent border-bottom, bold text
- Inactive: Gray text, hover effect
- Unsaved: Orange dot indicator
- Error: Red border or icon

### Spacing and Layout
- Tab padding: 8px horizontal, 6px vertical
- Gap between tabs: 4px
- Close button: 16x16px, appears on hover
- New workspace button: Fixed right position

## Error Handling

### Connection Failures
- Show error indicator on workspace tab
- Allow retry without closing workspace
- Preserve workspace state during connection issues

### Data Loss Prevention
- Auto-save query content every 30 seconds
- Warn before closing workspace with unsaved changes
- Implement recovery for crashed workspaces

### Edge Cases
- Maximum workspaces reached: Show notification
- Duplicate connection: Allow but show warning
- Connection deleted: Handle gracefully, offer to close workspace
- App crash: Restore workspaces from last saved state

## Success Metrics

### Quantitative
- Number of active workspaces per user session
- Workspace switch frequency
- Time saved vs. traditional connection switching
- User adoption rate

### Qualitative
- User feedback on productivity improvement
- Reduced error reports from wrong-database queries
- User satisfaction scores

## Future Enhancements

### Potential Features
- Workspace templates (save and restore workspace configurations)
- Workspace sharing (export/import workspace state)
- Split view (view multiple workspaces side-by-side)
- Workspace groups (organize related workspaces)
- Cloud sync (sync workspaces across devices)

### Integration Opportunities
- Integrate with project management tools
- Add workspace-specific notes/documentation
- Implement workspace-level permissions
- Add collaboration features (shared workspaces)

## Timeline Estimate

### Phase 1: Core Functionality (3-4 days)
- Day 1: Workspace context and state management
- Day 2: WorkspaceTabBar component and integration
- Day 3: Routing updates and basic switching
- Day 4: Testing and bug fixes

### Phase 2: State Isolation (2-3 days)
- Day 1: Query state isolation
- Day 2: Schema cache and navigation state
- Day 3: Testing and refinement

### Phase 3: Persistence (2-3 days)
- Day 1: LocalStorage and IndexedDB setup
- Day 2: Session restoration logic
- Day 3: Testing and edge cases

### Phase 4: Enhanced UX (2-3 days)
- Day 1: Visual enhancements and color coding
- Day 2: Keyboard shortcuts and tab management
- Day 3: Unsaved changes protection and polish

### Phase 5: Custom Titlebar (2-3 days)
- Day 1: Electron configuration and window controls
- Day 2: CustomTitleBar component integration
- Day 3: Platform-specific styling and testing

**Total Estimated Time: 11-16 days**

## Dependencies

### Required Libraries
- No new dependencies required (use existing React, React Router)

### Optional Libraries
- react-beautiful-dnd: For drag-and-drop tab reordering (Phase 4)
- uuid: For generating workspace IDs (can use crypto.randomUUID())

## Risks and Mitigation

### Risk: Increased Memory Usage
- Mitigation: Implement workspace data cleanup, set maximum limit, lazy loading

### Risk: Complex State Management
- Mitigation: Use proven patterns (Context API), thorough testing, clear documentation

### Risk: User Confusion
- Mitigation: Clear onboarding, tooltips, keyboard shortcut help, visual indicators

### Risk: Performance Degradation
- Mitigation: Performance monitoring, optimization strategies, user feedback

## Conclusion

Workspace tabs will significantly enhance the DB Toolkit's usability for users managing multiple databases. The phased approach allows for iterative development and user feedback integration, while the modular architecture ensures maintainability and extensibility.
