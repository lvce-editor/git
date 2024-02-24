import * as GitRequestsUnstageAll from '../src/parts/GitRequestsUnstageAll/GitRequestsUnstageAll.js'
import { jest } from '@jest/globals'

test('unstageAll', async () => {
  const exec = jest.fn()
  await GitRequestsUnstageAll.unstageAll({
    cwd: '/test/test-folder',
    gitPath: 'git',
    exec,
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['restore', '--staged', '.'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'unstageAll',
  })
})

test('unstageAll - error - not removing . recursively without -r', async () => {
  const exec = () => {
    throw new Error(`fatal: not removing '.' recursively without -r`)
  }
  await expect(
    GitRequestsUnstageAll.unstageAll({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error("Git: fatal: not removing '.' recursively without -r"))
})

test("unstageAll - error - pathspec '.' did not match any files", async () => {
  const exec = jest.fn(() => {
    throw new Error(`fatal: pathspec '.' did not match any files`)
  })
  await GitRequestsUnstageAll.unstageAll({
    cwd: '/test/test-folder',
    gitPath: '',
    exec,
  })
  expect(exec).toHaveBeenCalledTimes(1)
})
