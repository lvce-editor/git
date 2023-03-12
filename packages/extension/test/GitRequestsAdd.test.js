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

const GitRequestsAdd = await import(
  '../src/parts/GitRequestsAdd/GitRequestsAdd.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('add - error - not a git repository', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('fatal: not a git repository')
  })
  await expect(
    GitRequestsAdd.add({
      cwd: '',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: fatal: not a git repository'))
})

test('add - error - unknown git error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsAdd.add({
      cwd: '/test/test-folder',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
