import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => {
  return {
    execute: jest.fn(() => {}),
  }
})

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => {
  return {
    getCurrent() {
      return {
        gitPath: '/test/git',
        path: '/test/folder',
      }
    },
  }
})

const CommandInit = await import('../src/parts/CommandInit/CommandInit.ts')
const GitRepositoriesRequests = await import('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')
const Git = await import('../src/parts/Git/Git.ts')

test.skip('commandInit', async () => {
  await CommandInit.commandInit()
  expect(GitRepositoriesRequests.execute).toHaveBeenCalledTimes(1)
  expect(GitRepositoriesRequests.execute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.init,
    id: 'init',
  })
})
