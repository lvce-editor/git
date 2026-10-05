import { jest } from '@jest/globals'
import * as GitRequestsDiscard from '../src/parts/GitRequestsDiscard/GitRequestsDiscard.js'

test('discard', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  const confirm = jest.fn(() => true)
  const refresh = jest.fn<() => void>()
  await GitRequestsDiscard.discard({
    confirm,
    cwd: '/test/test-folder',
    exec,
    file: 'index.js',
    gitPath: 'git',
    refresh,
    remove() {},
  })
  expect(exec).toHaveBeenCalledTimes(2)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', 'index.js'], cwd: '/test/test-folder', gitPath: 'git', name: 'discard' })
  expect(refresh).toHaveBeenCalledTimes(1)
})

test('discard - confirm false', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  const confirm = jest.fn(() => false)
  const refresh = jest.fn<() => void>()
  await GitRequestsDiscard.discard({
    confirm,
    cwd: '/test/test-folder',
    exec,
    file: 'index.js',
    gitPath: 'git',
    refresh,
    remove() {},
  })
  expect(exec).not.toHaveBeenCalled()
  expect(refresh).not.toHaveBeenCalled()
})

test('discard does not refresh when restore fails', async (): Promise<void> => {
  const exec = jest.fn(async () => {
    throw new Error('restore failed')
  })
  const refresh = jest.fn<() => void>()
  await expect(
    GitRequestsDiscard.discard({
      confirm: () => true,
      cwd: '/test/test-folder',
      exec,
      file: 'index.js',
      gitPath: 'git',
      refresh,
      remove() {},
    }),
  ).rejects.toThrow('restore failed')
  expect(refresh).not.toHaveBeenCalled()
})
