import * as GitRequestsDiscard from '../src/parts/GitRequestsDiscard/GitRequestsDiscard.js'
import { jest } from '@jest/globals'

test('discard', async () => {
  const exec = jest.fn()
  const confirm = jest.fn(() => true)
  await GitRequestsDiscard.discard({
    cwd: '/test/test-folder',
    gitPath: 'git',
    file: 'index.js',
    exec,
    confirm,
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', 'index.js'], cwd: '/test/test-folder', gitPath: 'git', name: 'discard' })
})
