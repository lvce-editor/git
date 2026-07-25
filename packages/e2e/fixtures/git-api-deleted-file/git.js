export const actions = [
  {
    type: 'mkdir',
    path: 'workspace',
  },
  {
    type: 'git-init',
    cwd: 'workspace',
    initialBranch: 'main',
  },
  {
    type: 'git-config',
    cwd: 'workspace',
    key: 'user.name',
    value: 'Test User',
  },
  {
    type: 'git-config',
    cwd: 'workspace',
    key: 'user.email',
    value: 'test@example.com',
  },
  {
    type: 'mkdir',
    path: 'workspace/nested',
  },
  {
    type: 'write-file',
    path: 'workspace/deleted.txt',
    content: 'tracked content',
  },
  {
    type: 'write-file',
    path: 'workspace/nested/file.txt',
    content: 'nested content',
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['commit', '-m', 'Initial commit'],
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['rm', 'deleted.txt'],
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['reset', 'HEAD', '--', 'deleted.txt'],
  },
]
