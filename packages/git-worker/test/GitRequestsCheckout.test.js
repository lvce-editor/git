import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Exec/Exec.js', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GitRequestsCheckout = await import(
  '../src/parts/GitRequestsCheckout/GitRequestsCheckout.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

// TODO mock exec instead
class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('checkout - error - pathspec did not match any files known to git', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
