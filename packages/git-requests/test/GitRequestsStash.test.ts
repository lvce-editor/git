import { jest } from '@jest/globals'
import * as GitRequestsStash from '../src/parts/GitRequestsStash/GitRequestsStash.js'

class ExecError extends Error {
  constructor(stderr: string) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('stash - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }

  await expect(
    GitRequestsStash.stash({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})

test('stash', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsStash.stash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'push'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'stash',
  })
})

test('stash - message', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsStash.stash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    message: 'wip',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'push', '--message', 'wip'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'stash',
  })
})
