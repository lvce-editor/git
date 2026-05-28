import { jest } from '@jest/globals'
import * as GitRequestsInit from '../src/parts/GitRequestsInit/GitRequestsInit.js'

test('init - passes bare and initial branch arguments', async () => {
  const exec = jest.fn()
  await GitRequestsInit.init({
    bare: true,
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    initialBranch: 'main',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['init', '--bare', '--initial-branch', 'main'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'init',
  })
})
