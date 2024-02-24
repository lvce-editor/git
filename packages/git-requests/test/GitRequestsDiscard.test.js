import * as GitRequestsDiscard from '../src/parts/GitRequestsDiscard/GitRequestsDiscard.js'
import { jest } from '@jest/globals'

test('discard', async () => {
  const exec = jest.fn()
  await GitRequestsDiscard.discard({
    cwd: '/test/test-folder',
    gitPath: 'git',
    file: 'index.js',
    exec,
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', 'index.js'], cwd: '/test/test-folder', gitPath: 'git', name: 'discard' })
})
