import * as GitRequestsCleanAll from '../src/parts/GitRequestsCleanAll/GitRequestsCleanAll.js'
import { jest } from '@jest/globals'

test('cleanAll', async () => {
  const exec = jest.fn()
  await GitRequestsCleanAll.cleanAll({
    cwd: '/test/test-folder',
    gitPath: 'git',
    exec,
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', '.'], cwd: '/test/test-folder', gitPath: 'git', name: 'cleanAll' })
})
