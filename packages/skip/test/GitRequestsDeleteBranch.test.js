import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsDeleteBranch from '../src/parts/GitRequestsDeleteBranch/GitRequestsDeleteBranch.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('deleteBranch - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsDeleteBranch.deleteBranch({
      name: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
