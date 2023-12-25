import * as GitRequestsCommit from '../src/parts/GitRequestsCommit/GitRequestsCommit.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('commit - error - unmerged files', async () => {
  const exec = () => {
    throw new ExecError('not possible because you have unmerged files')
  }
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: not possible because you have unmerged files'))
})

test('commit - error - nothing to commit', async () => {
  const exec = () => {
    throw new ExecError('On branch main\nnothing to commit, working tree clean')
  }
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: nothing to commit'))
})

test('commit - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
