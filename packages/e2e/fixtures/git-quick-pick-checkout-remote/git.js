export const actions = [
  {
    type: 'git',
    cwd: '',
    args: ['init', '--bare', '--initial-branch', 'main', 'remote.git'],
  },
  {
    type: 'mkdir',
    path: 'seed',
  },
  {
    type: 'git-init',
    cwd: 'seed',
    initialBranch: 'main',
  },
  {
    type: 'git-config',
    cwd: 'seed',
    key: 'user.name',
    value: 'Test User',
  },
  {
    type: 'git-config',
    cwd: 'seed',
    key: 'user.email',
    value: 'test@example.com',
  },
  {
    type: 'write-file',
    path: 'seed/file.txt',
    content: 'main branch',
  },
  {
    type: 'git',
    cwd: 'seed',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'seed',
    args: ['commit', '-m', 'Initial commit'],
  },
  {
    type: 'git',
    cwd: 'seed',
    args: ['remote', 'add', 'origin', '../remote.git'],
  },
  {
    type: 'git',
    cwd: 'seed',
    args: ['push', '--set-upstream', 'origin', 'main'],
  },
  {
    type: 'git-clone',
    repositoryPath: 'remote.git',
    targetPath: 'workspace',
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
    type: 'git-clone',
    repositoryPath: 'remote.git',
    targetPath: 'upstream',
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
    type: 'git',
    cwd: 'upstream',
    args: ['checkout', '-b', 'remote-only'],
  },
  {
    type: 'write-file',
    path: 'upstream/remote-only.txt',
    content: 'remote-only branch',
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['commit', '-m', 'Remote-only branch'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['push', '--set-upstream', 'origin', 'remote-only'],
  },
  {
    type: 'git',
    cwd: 'workspace',
    args: ['fetch'],
  },
]
