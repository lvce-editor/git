/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GetCheckoutPicks from '../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockGetCheckoutPicks = jest.fn<typeof GetCheckoutPicks.getCheckoutPicks>()
const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts', () => ({
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

const CommandCheckout = await import('../src/parts/CommandCheckout/CommandCheckout.ts')
const CheckoutPickType = await import('../src/parts/CheckoutPickType/CheckoutPickType.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('checks out selected branch', async (): Promise<void> => {
  const picks = [
    {
      description: '1234567',
      icon: 'SourceControl',
      label: 'feature',
      type: CheckoutPickType.Ref,
    },
  ]
  mockGetCheckoutPicks.mockResolvedValue(picks)
  mockInvoke.mockResolvedValue(picks[0])
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBe('feature')
  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.show', picks)
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'feature',
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
})

test('does not checkout when quick pick is canceled', async (): Promise<void> => {
  mockGetCheckoutPicks.mockResolvedValue([])
  mockInvoke.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBeUndefined()
  expect(mockExecute).not.toHaveBeenCalled()
})

test('creates and checks out a new branch', async (): Promise<void> => {
  const picks = [
    {
      description: '',
      icon: 'Add',
      label: 'Create new branch...',
      type: CheckoutPickType.CreateBranch,
    },
  ]
  mockGetCheckoutPicks.mockResolvedValue(picks)
  mockInvoke.mockResolvedValueOnce(picks[0]).mockResolvedValueOnce('feature/new')
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBe('feature/new')
  expect(mockInvoke).toHaveBeenNthCalledWith(1, 'QuickPick.show', picks)
  expect(mockInvoke).toHaveBeenNthCalledWith(2, 'QuickPick.showInput', 'Branch name')
  expect(mockExecute).toHaveBeenNthCalledWith(1, {
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      name: 'feature/new',
    },
    fn: GitRequests.branch,
    id: 'branch',
  })
  expect(mockExecute).toHaveBeenNthCalledWith(2, {
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'feature/new',
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
})

test('cancels creating a new branch from the name input', async (): Promise<void> => {
  const action = {
    description: '',
    icon: 'Add',
    label: 'Create new branch...',
    type: CheckoutPickType.CreateBranch,
  }
  mockGetCheckoutPicks.mockResolvedValue([action])
  mockInvoke.mockResolvedValueOnce(action).mockResolvedValueOnce(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBeUndefined()
  expect(mockExecute).not.toHaveBeenCalled()
})

test('creates and checks out a new branch from a selected ref', async (): Promise<void> => {
  const action = {
    description: '',
    icon: 'Add',
    label: 'Create new branch from...',
    type: CheckoutPickType.CreateBranchFrom,
  }
  const ref = {
    description: '2 minutes ago • Test User • 1234567 • Initial commit',
    icon: 'Cloud',
    label: 'origin/main',
    type: CheckoutPickType.Ref,
  }
  const picks = [action, ref]
  mockGetCheckoutPicks.mockResolvedValue(picks)
  mockInvoke.mockResolvedValueOnce(action).mockResolvedValueOnce('feature/from-main').mockResolvedValueOnce(ref)
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBe('feature/from-main')
  expect(mockInvoke).toHaveBeenNthCalledWith(3, 'QuickPick.show', [ref])
  expect(mockExecute).toHaveBeenNthCalledWith(1, {
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      name: 'feature/from-main',
      startPoint: 'origin/main',
    },
    fn: GitRequests.branch,
    id: 'branch',
  })
  expect(mockExecute).toHaveBeenNthCalledWith(2, {
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'feature/from-main',
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
})

test('cancels creating a new branch when no start ref is selected', async (): Promise<void> => {
  const action = {
    description: '',
    icon: 'Add',
    label: 'Create new branch from...',
    type: CheckoutPickType.CreateBranchFrom,
  }
  mockGetCheckoutPicks.mockResolvedValue([action])
  mockInvoke.mockResolvedValueOnce(action).mockResolvedValueOnce('feature/canceled').mockResolvedValueOnce(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBeUndefined()
  expect(mockExecute).not.toHaveBeenCalled()
})
