import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-sync'
export const skip = navigator.platform === 'Win32'

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const upstreamDir = `${tmpDir}/upstream`
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-status-bar-sync')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')
  await Git.checkout('main')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toBeVisible()
  await expect(syncStatusBarItem).toHaveText('1↓ 1↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Pull 1 and push 1 commits between origin/main')
  await expect(syncStatusBarItem.locator('.MaskIconSync')).toBeVisible()

  // act
  await Command.execute('StatusBar.handleClick', 'git.sync')
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/remote-file.txt`, 'remote change')
  await FileSystem.shouldHaveFile(`${workspaceDir}/local-file.txt`, 'local change')
  await expect(syncStatusBarItem).toHaveText('')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Synchronize Changes')

  // arrange an outgoing-only change
  await FileSystem.writeFile(`${workspaceDir}/outgoing.txt`, 'outgoing change')
  await Git.add('outgoing.txt')
  await Git.commit('Outgoing change')
  await Workspace.setPath(tmpDir)
  await Workspace.setPath(workspaceDir)

  // assert
  await expect(syncStatusBarItem).toHaveText('1↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Push 1 commits to origin/main')

  // arrange an incoming-only change
  await Command.execute('ExtensionHost.executeCommand', 'git.push', {})
  await Workspace.setPath(upstreamDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.pull', {})
  await FileSystem.writeFile(`${upstreamDir}/incoming.txt`, 'incoming change')
  await Git.add('incoming.txt')
  await Git.commit('Incoming change')
  await Command.execute('ExtensionHost.executeCommand', 'git.push', {})
  await Workspace.setPath(workspaceDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')
  await Workspace.setPath(tmpDir)
  await Workspace.setPath(workspaceDir)

  // assert
  await expect(syncStatusBarItem).toHaveText('1↓')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Pull 1 commits from origin/main')
}
