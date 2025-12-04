import { jest } from '@jest/globals'
import * as GitRequestsCleanAll from '../src/parts/GitRequestsCleanAll/GitRequestsCleanAll.js'

test('cleanAll', async () => {
  const exec = jest.fn()
  await GitRequestsCleanAll.cleanAll({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', '.'], cwd: '/test/test-folder', gitPath: 'git', name: 'cleanAll' })
})
