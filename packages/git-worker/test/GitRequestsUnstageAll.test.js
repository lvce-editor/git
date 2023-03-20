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

const GitRequestsVersion = await import(
  '../src/parts/GitRequestsVersion/GitRequestsVersion.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

test('unstageAll - error - not removing . recursively without -r', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new Error(`fatal: not removing '.' recursively without -r`)
  })
  await expect(
    GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error("Git: fatal: not removing '.' recursively without -r")
  )
})
