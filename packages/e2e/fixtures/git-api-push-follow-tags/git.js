export const actions = [
  {
    type: 'git',
    cwd: '',
    args: ['init', '--bare', '--initial-branch', 'main', 'remote.git'],
  },
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
    path: 'workspace/new-file.txt',
    content: 'pushed content',
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
    args: ['tag', '-a', 'v0.1', '-m', 'Release v0.1'],
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['remote', 'add', 'origin', '../remote.git'],
  },
]
