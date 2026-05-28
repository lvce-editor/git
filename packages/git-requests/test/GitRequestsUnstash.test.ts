import { jest } from '@jest/globals'
import * as GitRequestsUnstash from '../src/parts/GitRequestsUnstash/GitRequestsUnstash.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('unstash - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }

  await expect(
    GitRequestsUnstash.unstash({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})

test('unstash', async () => {
  const exec = jest.fn()
  await GitRequestsUnstash.unstash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'pop'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'unstash',
  })
})

test('unstash - stash reference', async () => {
  const exec = jest.fn()
  await GitRequestsUnstash.unstash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    stashReference: 'stash@{1}',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'pop', 'stash@{1}'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'unstash',
  })
})
