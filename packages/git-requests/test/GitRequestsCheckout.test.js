import * as GitRequestsCheckout from '../src/parts/GitRequestsCheckout/GitRequestsCheckout.js'

// TODO mock exec instead
class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('checkout - error - pathspec did not match any files known to git', async () => {
  const exec = () => {
    throw new ExecError(`error: pathspec 'abc' did not match any file(s) known to git`)
  }
  await expect(
    GitRequestsCheckout.checkout({
      cwd: '',
      ref: 'abc',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error(`Git: error: pathspec 'abc' did not match any file(s) known to git`))
})

test('checkout - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsCheckout.checkout({
      ref: '',
      cwd: '',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
