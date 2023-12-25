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

const GitRequestsUnstageAll = await import('../src/parts/GitRequestsUnstageAll/GitRequestsUnstageAll.js')
const Exec = await import('../src/parts/Exec/Exec.js')

test.skip('unstageAll', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
    }
  })
  GitRequestsUnstageAll.unstageAll({
    cwd: '/test/test-folder',
    gitPath: 'git',
  })
  expect(Exec.exec).toHaveBeenCalledTimes(1)
  expect(Exec.exec).toHaveBeenCalledWith('git', ['rm', '--cached', '-r', '.'], {
    cwd: '/test/test-folder',
    env: expect.anything(),
  })
})

test('unstageAll - error - not removing . recursively without -r', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new Error(`fatal: not removing '.' recursively without -r`)
  })
  await expect(
    GitRequestsUnstageAll.unstageAll({
      cwd: '/test/test-folder',
      gitPath: '',
    }),
  ).rejects.toThrowError(new Error("Git: fatal: not removing '.' recursively without -r"))
})

test("unstageAll - error - pathspec '.' did not match any files", async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new Error(`fatal: pathspec '.' did not match any files`)
  })
  await GitRequestsUnstageAll.unstageAll({
    cwd: '/test/test-folder',
    gitPath: '',
  })
  expect(Exec.exec).toHaveBeenCalledTimes(1)
})
