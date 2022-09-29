import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsCheckout from '../src/parts/GitRequestsCheckout/GitRequestsCheckout.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('checkout - error - pathspec did not match any files known to git', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError(
      `error: pathspec 'abc' did not match any file(s) known to git`
    )
  })
  await expect(
    GitRequestsCheckout.checkout({
      cwd: '',
      ref: 'abc',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error(
      `Git: error: pathspec 'abc' did not match any file(s) known to git`
    )
  )
})

test('checkout - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsCheckout.checkout({
      ref: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
