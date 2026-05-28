import { jest } from '@jest/globals'

const mockGetCurrent = jest.fn()
const mockExecute = jest.fn()

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

const CommandInit = await import('../src/parts/CommandInit/CommandInit.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('commandInit', async (): Promise<void> => {
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await CommandInit.commandInit()
  expect(mockExecute).toHaveBeenCalledTimes(1)
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.init,
    id: 'init',
  })
})
