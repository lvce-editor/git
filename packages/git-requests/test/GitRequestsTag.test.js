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

const GitRequestsTag = await import(
  '../src/parts/GitRequestsTag/GitRequestsTag.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('tag - error - tag already exists', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError(`fatal: tag 'abc' already exists`)
  })
  await expect(
    GitRequestsTag.tag({
      tag: 'v0.1',
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error("Git: fatal: tag 'abc' already exists"))
})
