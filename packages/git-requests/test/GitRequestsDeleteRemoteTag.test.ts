import { jest } from '@jest/globals'
import * as GitRequestsDeleteRemoteTag from '../src/parts/GitRequestsDeleteRemoteTag/GitRequestsDeleteRemoteTag.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('deleteRemoteTag - error - tag does not exist', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError("error: unable to delete 'v0.1': remote ref does not exist")
  }
  await expect(
    GitRequestsDeleteRemoteTag.deleteRemoteTag({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      tag: 'v0.1',
    }),
  ).rejects.toThrow(new Error("Git: error: unable to delete 'v0.1': remote ref does not exist"))
})

test('deleteRemoteTag - success', async (): Promise<void> => {
  const exec = jest.fn(async () => ({
    stderr: '',
    stdout: '',
  }))
  await GitRequestsDeleteRemoteTag.deleteRemoteTag({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    tag: 'v0.1',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['push', 'origin', ':refs/tags/v0.1'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'deleteRemoteTag',
  })
})
