export const actions = [
  {
    type: 'mkdir',
    path: 'workspace',
  },
  {
    type: 'git-init',
    cwd: 'workspace',
    initialBranch: 'feature/pr',
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
    args: ['commit', '-m', 'feature: create pull requests'],
  },
  { type: 'git', cwd: 'workspace', args: ['remote', 'add', 'origin', 'https://github.com/lvce-editor/pull-request-github.git'] },
  { type: 'git', cwd: 'workspace', args: ['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main'] },
]
