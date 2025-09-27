# Git-Web

Web-compatible git command emulation for the Lvce Editor git extension.

## Overview

Git-Web provides a web-compatible implementation of git commands that can run in environments where native git is not available (such as web browsers, VS Code web, or GitHub Codespaces).

## Architecture

The git extension now uses scheme-based routing:

- **file:// schemes**: Uses native git binary for maximum performance and accuracy
- **web://, vscode://, https:// schemes**: Uses git-web emulation for web compatibility

## Features

- **Complete git command emulation**: Supports all major git commands (init, add, commit, push, pull, status, etc.)
- **Virtual repository state**: Maintains in-memory git repository state
- **Error handling**: Proper exit codes and error messages matching git behavior
- **TypeScript support**: Full type safety and IntelliSense

## Supported Commands

- `git --version` - Returns version information
- `git init` - Initialize a new repository
- `git status` - Show working directory status
- `git add` - Stage files for commit
- `git commit` - Create a new commit
- `git push` - Push changes to remote
- `git pull` - Pull changes from remote
- `git fetch` - Fetch changes from remote
- `git checkout` - Switch branches
- `git branch` - List/create branches
- `git log` - Show commit history
- `git diff` - Show differences
- `git rev-parse` - Parse git references
- `git for-each-ref` - List references
- `git remote` - Manage remotes
- `git config` - Manage configuration

## Usage

The git-web package is automatically used by the git extension when working with non-file schemes. No manual configuration is required.

## Development

```bash
# Build the package
npm run build

# Run tests
npm test
```

## Implementation Details

The package uses an in-memory virtual repository system that simulates git behavior without requiring a real file system or git binary. This makes it perfect for web environments while maintaining compatibility with the existing git extension API.
