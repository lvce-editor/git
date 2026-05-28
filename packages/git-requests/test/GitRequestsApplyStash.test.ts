import { jest } from '@jest/globals'
import * as GitRequestsApplyStash from '../src/parts/GitRequestsApplyStash/GitRequestsApplyStash.js'

class ExecError extends Error {
  constructor(stderr: string) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('applyStash - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }

  await expect(
    GitRequestsApplyStash.applyStash({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})

test('applyStash', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsApplyStash.applyStash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'apply'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'applyStash',
  })
})

test('applyStash - stash reference', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsApplyStash.applyStash({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    stashReference: 'stash@{1}',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['stash', 'apply', 'stash@{1}'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'applyStash',
  })
})
