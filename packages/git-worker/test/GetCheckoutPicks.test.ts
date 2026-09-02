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

test('puts actions first, then local branches, remote branches, and tags ordered by recency', async () => {
  mockExecute.mockResolvedValue([
    {
      authorName: 'Test User',
      commit: '1234567890abcdef1234567890abcdef12345678',
      commitDate: '30 seconds ago',
      name: 'origin/HEAD',
      remote: 'origin',
      subject: 'Initial commit',
      symbolicRef: 'origin/main',
      type: GitRefType.RemoteHead,
    },
    {
      authorName: 'Remote User',
      commit: 'abcdef1234567890abcdef1234567890abcdef12',
      commitDate: '1 minute ago',
      name: 'origin/feature',
      remote: 'origin',
      subject: 'Remote feature',
      type: GitRefType.RemoteHead,
    },
    {
      authorName: 'Feature Author',
      commit: '234567890abcdef1234567890abcdef123456789',
      commitDate: '2 minutes ago',
      name: 'feature',
      remote: '',
      subject: 'Local feature',
      type: GitRefType.Head,
    },
    {
      authorName: 'Release Bot',
      commit: '34567890abcdef1234567890abcdef1234567890',
      commitDate: '3 minutes ago',
      name: 'v1.0.0',
      remote: '',
      subject: 'Release 1.0.0',
      type: GitRefType.Tag,
    },
    {
      authorName: 'Test User',
      commit: '1234567890abcdef1234567890abcdef12345678',
      commitDate: '5 minutes ago',
      name: 'main',
      remote: '',
      subject: 'Initial commit',
      type: GitRefType.Head,
    },
    {
      authorName: 'Remote User',
      commit: '4567890abcdef1234567890abcdef12345678901',
      commitDate: '5 minutes ago',
      name: 'origin/main',
      remote: 'origin',
      subject: 'Remote main',
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
      description: '5 minutes ago • Test User • 12345678 • Initial commit',
      icon: 'SourceControl',
      label: 'main',
      type: CheckoutPickType.Ref,
    },
    {
      description: '2 minutes ago • Feature Author • 23456789 • Local feature',
      icon: 'SourceControl',
      label: 'feature',
      type: CheckoutPickType.Ref,
    },
    {
      description: '1 minute ago • Remote User • abcdef12 • Remote feature',
      icon: 'Cloud',
      label: 'origin/feature',
      type: CheckoutPickType.Ref,
    },
    {
      description: '5 minutes ago • Remote User • 4567890a • Remote main',
      icon: 'Cloud',
      label: 'origin/main',
      type: CheckoutPickType.Ref,
    },
    {
      description: '3 minutes ago • Release Bot • 34567890 • Release 1.0.0',
      icon: 'Tag',
      label: 'v1.0.0',
      type: CheckoutPickType.Ref,
    },
  ])
})
