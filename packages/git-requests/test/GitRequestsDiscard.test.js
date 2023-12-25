import { jest } from '@jest/globals'

import * as GitRequestsDiscard from '../src/parts/GitRequestsDiscard/GitRequestsDiscard.js'

test.skip('discard', async () => {
  const exec = () => {
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
    }
  }
  await GitRequestsDiscard.discard({
    cwd: '/test/test-folder',
    gitPath: 'git',
    file: 'index.js',
    exec,
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith('git', ['clean', '-f', '-q', 'index.js'], {
    cwd: '/test/test-folder',
  })
})
