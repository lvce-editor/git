/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'

const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

const CheckoutPickType = await import('../src/parts/CheckoutPickType/CheckoutPickType.ts')
const GetCheckoutPicks = await import('../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts')
const GitRefType = await import('../src/parts/GitRefType/GitRefType.ts')

beforeEach(() => {
  jest.resetAllMocks()
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
})

test('puts branch actions before refs and includes ref metadata', async () => {
  mockExecute.mockResolvedValue([
    {
      authorName: 'Test User',
      commit: '1234567890abcdef1234567890abcdef12345678',
      commitDate: '2 minutes ago',
      name: 'main',
      remote: '',
      subject: 'Initial commit',
      type: GitRefType.Head,
    },
    {
      authorName: 'Remote User',
      commit: 'abcdef1234567890abcdef1234567890abcdef12',
      commitDate: '1 day ago',
      name: 'origin/feature',
      remote: 'origin',
      subject: 'Remote feature',
      type: GitRefType.RemoteHead,
    },
  ])

  await expect(GetCheckoutPicks.getCheckoutPicks()).resolves.toEqual([
    {
      description: '',
      icon: 'Add',
      label: 'Create new branch...',
      type: CheckoutPickType.CreateBranch,
    },
    {
      description: '',
      icon: 'Add',
      label: 'Create new branch from...',
      type: CheckoutPickType.CreateBranchFrom,
    },
    {
      description: '2 minutes ago • Test User • 12345678 • Initial commit',
      icon: 'SourceControl',
      label: 'main',
      type: CheckoutPickType.Ref,
    },
    {
      description: '1 day ago • Remote User • abcdef12 • Remote feature',
      icon: 'Cloud',
      label: 'origin/feature',
      type: CheckoutPickType.Ref,
    },
  ])
})
