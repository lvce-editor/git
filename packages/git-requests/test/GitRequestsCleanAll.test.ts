import { jest } from '@jest/globals'
import * as GitRequestsCleanAll from '../src/parts/GitRequestsCleanAll/GitRequestsCleanAll.js'

test('cleanAll', async (): Promise<void> => {
  const exec = jest.fn(async () => ({ stderr: '', stdout: '' }))
  await GitRequestsCleanAll.cleanAll({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({ args: ['restore', '--', '.'], cwd: '/test/test-folder', gitPath: 'git', name: 'cleanAll' })
})
