export const actions = [
  {
    type: 'mkdir',
    path: 'source',
  },
  {
    type: 'git-init',
    cwd: 'source',
    initialBranch: 'main',
  },
  {
    type: 'git-config',
    cwd: 'source',
    key: 'user.name',
    value: 'Test User',
  },
  {
    type: 'git-config',
    cwd: 'source',
    key: 'user.email',
    value: 'test@example.com',
  },
  {
    type: 'write-file',
    path: 'source/file.txt',
    content: 'cloned from disk',
  },
  {
    type: 'git',
    cwd: 'source',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'source',
    args: ['commit', '-m', 'Initial commit'],
  },
]
