export const actions = [
  {
    type: 'git-clone',
    repositoryPath: 'remote.git',
    targetPath: 'verify',
  },
  {
    type: 'git',
    cwd: 'verify',
    args: ['checkout', 'main'],
  },
]
