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
        path: '/test/folder',
        gitPath: '/test/git',
      }
    },
  }
})

const CommandInit = await import('../src/parts/CommandInit/CommandInit.ts')
const GitRepositoriesRequests = await import('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')
const Git = await import('../src/parts/Git/Git.ts')

test('commandInit', async () => {
  await CommandInit.commandInit()
  expect(GitRepositoriesRequests.execute).toHaveBeenCalledTimes(1)
  expect(GitRepositoriesRequests.execute).toHaveBeenCalledWith({
    id: 'init',
    fn: GitRequests.init,
    args: {
      cwd: '/test/folder',
      gitPath: '/test/git',
      exec: Git.exec,
    },
  })
})
