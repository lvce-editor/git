export const actions = [
  {
    type: 'mkdir',
    path: 'upstream',
  },
  {
    type: 'git-init',
    cwd: 'upstream',
    initialBranch: 'main',
  },
  {
    type: 'git-config',
    cwd: 'upstream',
    key: 'user.name',
    value: 'Test User',
  },
  {
    type: 'git-config',
    cwd: 'upstream',
    key: 'user.email',
    value: 'test@example.com',
  },
  {
    type: 'write-file',
    path: 'upstream/file.txt',
    content: 'version 1',
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['commit', '-m', 'Initial commit'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['branch', 'feature'],
  },
  {
    type: 'git-clone',
    repositoryPath: 'upstream',
    targetPath: 'workspace',
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['branch', '-D', 'feature'],
  },
]
