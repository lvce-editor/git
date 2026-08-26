export const actions = [
  {
    type: 'mkdir',
    path: 'first-workspace',
  },
  {
    type: 'git-init',
    cwd: 'first-workspace',
    initialBranch: 'main',
  },
  {
    type: 'git-config',
    cwd: 'first-workspace',
    key: 'user.name',
    value: 'Test User',
  },
  {
    type: 'git-config',
    cwd: 'first-workspace',
    key: 'user.email',
    value: 'test@example.com',
  },
  {
    type: 'write-file',
    path: 'first-workspace/file.txt',
    content: 'first workspace',
  },
  {
    type: 'git',
    cwd: 'first-workspace',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'first-workspace',
    args: ['commit', '-m', 'Initial commit'],
  },
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
    path: 'upstream/base.txt',
    content: 'base',
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
    type: 'git-clone',
    repositoryPath: 'upstream',
    targetPath: 'second-workspace',
  },
  {
    type: 'write-file',
    path: 'upstream/incoming-one.txt',
    content: 'incoming one',
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['commit', '-m', 'First incoming commit'],
  },
  {
    type: 'write-file',
    path: 'upstream/incoming-two.txt',
    content: 'incoming two',
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['add', '.'],
  },
  {
    type: 'git',
    cwd: 'upstream',
    args: ['commit', '-m', 'Second incoming commit'],
  },
]
