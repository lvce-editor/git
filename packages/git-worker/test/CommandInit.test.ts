import { jest } from '@jest/globals'
import * as CommandInit from '../src/parts/CommandInit/CommandInit.ts'
import * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../src/parts/GitRequests/GitRequests.ts'
import * as Git from '../src/parts/Git/Git.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

test('commandInit', async (): Promise<void> => {
  jest.spyOn(GitRepositories, 'getCurrent').mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  const execute = jest.spyOn(GitRepositoriesRequests, 'execute').mockResolvedValue(undefined)

  await CommandInit.commandInit()
  expect(execute).toHaveBeenCalledTimes(1)
  expect(execute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.init,
    id: 'init',
  })
})
