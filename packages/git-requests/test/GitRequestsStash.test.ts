import { jest } from '@jest/globals'
import * as GitRequestsStash from '../src/parts/GitRequestsStash/GitRequestsStash.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('stash - error - unknown git error', async () => {
  const exec = () => {
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

test('stash', async () => {
  const exec = jest.fn()
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

test('stash - message', async () => {
  const exec = jest.fn()
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
