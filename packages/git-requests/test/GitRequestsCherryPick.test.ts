import { jest } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsCherryPick from '../src/parts/GitRequestsCherryPick/GitRequestsCherryPick.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('cherryPick - passes ref argument', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsCherryPick.cherryPick({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    ref: 'abc123',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['cherry-pick', 'abc123'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'cherry-pick',
  })
})

test('cherryPick - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsCherryPick.cherryPick({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      ref: 'abc123',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
