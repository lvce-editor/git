import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-sync'
export const skip = 1

const yieldToEventLoop = (): Promise<void> =>
  new Promise((resolve) => {
    const channel = new MessageChannel()
    channel.port1.onmessage = (): void => {
      channel.port1.close()
      channel.port2.close()
      resolve()
    }
    channel.port2.postMessage(null)
  })

const waitFor = async (condition: () => Promise<void>): Promise<void> => {
  let lastError: unknown
  for (let attempt = 0; attempt < 500; attempt++) {
    try {
      await condition()
      return
    } catch (error) {
      lastError = error
      await yieldToEventLoop()
    }
  }
  throw lastError
}

export const test: Test = async ({ Command, expect, FileSystem, Git, Locator, Settings, SideBar, Workspace }) => {
  await Settings.update({ 'git.branchProtection': false })
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const upstreamDir = `${tmpDir}/upstream`
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-status-bar-sync')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await SideBar.open('Source Control')
  await Git.checkout('main')
  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')

  await expect(syncStatusBarItem).toBeVisible()
  await waitFor(() => expect(syncStatusBarItem).toHaveText('1↓ 1↑'))
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Pull 1 and push 1 commits between origin/main')
  const syncIcon = syncStatusBarItem.locator('.MaskIconSync')
  await expect(syncIcon).toBeVisible()

  // act
  await Command.execute('StatusBar.handleClick', 'git.sync')

  // assert
  await waitFor(() => expect(syncStatusBarItem).toHaveText('0↓ 0↑'))
  await FileSystem.shouldHaveFile(`${workspaceDir}/remote-file.txt`, 'remote change')
  await FileSystem.shouldHaveFile(`${workspaceDir}/local-file.txt`, 'local change')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Synchronize Changes')

  // arrange an outgoing-only change
  await FileSystem.writeFile(`${workspaceDir}/outgoing.txt`, 'outgoing change')
  await Git.add('outgoing.txt')
  await Git.commit('Outgoing change')
  await Workspace.setUri(tmpDir)
  await Workspace.setUri(workspaceDir)

  // assert
  await expect(syncStatusBarItem).toHaveText('0↓ 1↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Push 1 commits to origin/main')

  // arrange an incoming-only change
  await Command.execute('ExtensionHost.executeCommand', 'git.push', {})
  await Workspace.setUri(upstreamDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.pull', {})
  await FileSystem.writeFile(`${upstreamDir}/incoming.txt`, 'incoming change')
  await Git.add('incoming.txt')
  await Git.commit('Incoming change')
  await Command.execute('ExtensionHost.executeCommand', 'git.push', {})
  await Workspace.setUri(workspaceDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.fetch')
  await Workspace.setUri(tmpDir)
  await Workspace.setUri(workspaceDir)

  // assert
  await expect(syncStatusBarItem).toHaveText('1↓ 0↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'workspace (Git) - Pull 1 commits from origin/main')
}
