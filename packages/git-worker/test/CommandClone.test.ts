/* eslint-disable jest/no-restricted-jest-methods */
import { beforeEach, expect, jest, test } from '@jest/globals'
import type * as Git from '../src/parts/Git/Git.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockGitExec = jest.fn<typeof Git.exec>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/Git/Git.ts', () => ({
  exec: mockGitExec,
}))

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const CommandClone = await import('../src/parts/CommandClone/CommandClone.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('clones into the configured location and opens the repository', async () => {
  mockInvoke.mockImplementation(async (method: string): Promise<any> => {
    switch (method) {
      case 'Config.getDefaultCloneLocation':
        return '/projects'
      case 'Config.getGitPaths':
        return ['/usr/bin/git']
      case 'FileSystem.exists':
        return true
      case 'QuickPick.showInput':
        return 'git@github.com:lvce-editor/simple-browser-view.git'
      default:
        return undefined
    }
  })

  await expect(CommandClone.commandClone()).resolves.toBe('/projects/simple-browser-view')
  expect(mockGitExec).toHaveBeenCalledWith({
    args: ['clone', 'git@github.com:lvce-editor/simple-browser-view.git', '/projects/simple-browser-view'],
    cwd: '/projects',
    gitPath: '/usr/bin/git',
  })
  expect(mockInvoke).toHaveBeenCalledWith('Workspace.setWorkspaceUri', '/projects/simple-browser-view')
  expect(mockInvoke).not.toHaveBeenCalledWith('FileSystem.mkdir', expect.anything())
})

test('uses the user data Documents directory by default', async () => {
  mockInvoke.mockImplementation(async (method: string): Promise<any> => {
    switch (method) {
      case 'Config.getDefaultCloneLocation':
        return undefined
      case 'Config.getGitPaths':
        return ['git']
      case 'FileSystem.exists':
        return false
      case 'Platform.getUserDataDir':
        return 'file:///home/test/.config/lvce-oss'
      case 'QuickPick.showInput':
        return 'git@github.com/simple-browser-view.git'
      default:
        return undefined
    }
  })

  await expect(CommandClone.commandClone()).resolves.toBe('/home/test/.config/lvce-oss/Documents/simple-browser-view')
  expect(mockInvoke).toHaveBeenCalledWith('FileSystem.mkdir', '/home/test/.config/lvce-oss/Documents')
  expect(mockGitExec).toHaveBeenCalledWith({
    args: ['clone', 'git@github.com/simple-browser-view.git', '/home/test/.config/lvce-oss/Documents/simple-browser-view'],
    cwd: '/home/test/.config/lvce-oss/Documents',
    gitPath: 'git',
  })
})

test('does nothing when repository input is canceled', async () => {
  mockInvoke.mockResolvedValue(undefined)

  await expect(CommandClone.commandClone()).resolves.toBeUndefined()
  expect(mockGitExec).not.toHaveBeenCalled()
  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.showInput', 'Repository URL')
})
