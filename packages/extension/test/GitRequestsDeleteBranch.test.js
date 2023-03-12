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

const GitRequestsDeleteBranch = await import(
  '../src/parts/GitRequestsDeleteBranch/GitRequestsDeleteBranch.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('deleteBranch - error - unknown git error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
