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
    type: 'write-file',
    path: 'workspace/file.txt',
    content: 'main branch',
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
]
