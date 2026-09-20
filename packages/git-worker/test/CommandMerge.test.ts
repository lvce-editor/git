/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GetCheckoutPicks from '../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockGetCheckoutPicks = jest.fn<typeof GetCheckoutPicks.getCheckoutPicks>()
const mockGetBranchPicks = jest.fn<typeof GetCheckoutPicks.getBranchPicks>()
const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts', () => ({
  getBranchPicks: mockGetBranchPicks,
  getCheckoutPicks: mockGetCheckoutPicks,
}))

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const CommandMerge = await import('../src/parts/CommandMerge/CommandMerge.ts')
const CheckoutPickType = await import('../src/parts/CheckoutPickType/CheckoutPickType.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

const repository = {
  gitPath: '/test/git',
  gitVersion: '2.39.2',
  path: '/test/folder',
  remoteWorkspaceUri: '/test/folder',
  workspaceUri: '/test/folder',
}

test('merges the selected branch when no ref is supplied', async (): Promise<void> => {
  const branch = {
    description: '1234567',
    icon: 'SourceControl',
    label: 'feature',
    type: CheckoutPickType.Ref,
  }
  const remoteBranch = {
    description: 'abcdef0',
    icon: 'Cloud',
    label: 'origin/feature',
    remote: 'origin',
    type: CheckoutPickType.Ref,
  }
  const picks = [branch, remoteBranch]
  mockGetBranchPicks.mockResolvedValue(picks)
  mockInvoke.mockResolvedValue(remoteBranch)
  mockGetCurrent.mockResolvedValue(repository)
  mockExecute.mockResolvedValue(undefined)

  await CommandMerge.commandMerge()

  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.show', [branch, remoteBranch])
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'origin/feature',
    },
    fn: GitRequests.merge,
    id: 'merge',
  })
})

test('does not merge when branch selection is canceled', async (): Promise<void> => {
  mockGetBranchPicks.mockResolvedValue([])
  mockInvoke.mockResolvedValue(undefined)

  await CommandMerge.commandMerge()

  expect(mockExecute).not.toHaveBeenCalled()
})

test('merges an explicit ref without showing a quick pick', async (): Promise<void> => {
  mockGetCurrent.mockResolvedValue(repository)
  mockExecute.mockResolvedValue(undefined)

  await CommandMerge.commandMerge('feature')

  expect(mockGetCheckoutPicks).not.toHaveBeenCalled()
  expect(mockInvoke).not.toHaveBeenCalled()
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'feature',
    },
    fn: GitRequests.merge,
    id: 'merge',
  })
})
