import * as GitRequestsDeleteBranch from '../src/parts/GitRequestsDeleteBranch/GitRequestsDeleteBranch.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('deleteBranch - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsDeleteBranch.deleteBranch({
      cwd: '',
      exec,
      gitPath: '',
      name: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
