# Branch-Based Development SOP

## Overview
This project uses a branch-based development workflow where each Claude Code session works on a dedicated branch. Each branch represents a specific feature, task, or improvement.

## Branch Naming Convention
```
claude-session-YYYYMMDD-HHMMSS
```
Example: `claude-session-20250822-122113`

## Branch Documentation Structure
Each branch should have its own documentation in the `/branch/` directory:

```
/branch/
├── [branch-name].md          # Main branch description and status
├── templates/
│   └── branch-template.md    # Template for new branches
└── completed/
    └── [completed-branches] # Archive of completed branch docs
```

## Workflow Steps

### 1. Branch Creation
- Claude Code automatically creates timestamped branches
- Each new session = new branch
- Branch immediately gets documentation in `/branch/[branch-name].md`

### 2. Branch Documentation
When starting work on a branch, create documentation using the template:
- **Purpose**: What this branch accomplishes
- **Tasks**: Specific items to complete
- **Status**: In Progress / Testing / Complete
- **Notes**: Important implementation details

### 3. Development Process
- Work exclusively on your branch
- Update branch documentation as you progress
- Mark tasks complete in the documentation
- Test thoroughly before marking branch complete

### 4. Branch Completion
When branch is complete:
1. Update status to "Complete" in branch documentation
2. Move documentation to `/branch/completed/`
3. Create pull request to merge into main
4. Archive the branch

### 5. Integration
- Use pull requests for controlled integration
- Review changes before merging to main
- Keep main branch stable and deployable

## Branch Documentation Requirements

### Required Sections
- **Branch Name**: Full git branch name
- **Date Created**: YYYY-MM-DD
- **Purpose**: One-line description
- **Tasks**: Checkbox list of items to complete
- **Status**: Current state (In Progress/Testing/Complete)
- **Implementation Notes**: Technical details
- **Completion Criteria**: What defines "done"

### Status Updates
- Update status regularly as work progresses
- Mark individual tasks complete with timestamps
- Note any blockers or issues encountered

## File Organization
```
/branch/
├── claude-session-20250822-122113.md    # Current branch doc
├── claude-session-20250821-150230.md    # Previous branch doc
├── templates/
│   └── branch-template.md               # Template for new branches
└── completed/
    ├── setup-initial-repo.md            # Completed and archived
    └── add-authentication.md            # Completed and archived
```

## Benefits
- **Isolation**: Each task is isolated in its own branch
- **Documentation**: Clear record of what each branch accomplishes
- **Collaboration**: Multiple people can work on different branches
- **Rollback**: Easy to revert specific changes
- **History**: Complete audit trail of development progress

## Claude Code Integration
- Each Claude Code session automatically works on its timestamped branch
- Branch documentation is created and maintained throughout the session
- Status is updated as tasks are completed
- Final status update marks branch as complete and ready for integration