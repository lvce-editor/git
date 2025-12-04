import { jest } from '@jest/globals'
import * as GitRequestsDiscard from '../src/parts/GitRequestsDiscard/GitRequestsDiscard.js'

test.skip('discard', async () => {
  const exec = jest.fn()
  const confirm = jest.fn(() => true)
  await GitRequestsDiscard.discard({
    confirm,
    cwd: '/test/test-folder',
    exec,
    file: 'index.js',
    gitPath: 'git',
    remove() {},
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', 'index.js'], cwd: '/test/test-folder', gitPath: 'git', name: 'discard' })
})

test.skip('discard - confirm false', async () => {
  const exec = jest.fn()
  const confirm = jest.fn(() => false)
  await GitRequestsDiscard.discard({
    confirm,
    cwd: '/test/test-folder',
    exec,
    file: 'index.js',
    gitPath: 'git',
    remove() {},
  })
  expect(exec).not.toHaveBeenCalled()
})
