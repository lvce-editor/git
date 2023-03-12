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

test('version', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    return {
      stdout: 'git version 2.34.1',
      stderr: '',
    }
  })
  expect(
    await GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).toBe('2.34.1')
})

test('version - error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new TypeError(`x is not a function`)
  })
  await expect(
    GitRequestsVersion.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: x is not a function'))
})
