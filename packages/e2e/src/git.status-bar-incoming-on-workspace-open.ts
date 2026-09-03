import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.status-bar-incoming-on-workspace-open'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/second-workspace`

  await Workspace.setPath(tmpDir)
  await Settings.update({
    'git.runFetchOnWorkspaceOpen': true,
  })
  const fixtureUrl = import.meta.resolve('../fixtures/git-fetch-on-workspace-open')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)

  await Workspace.setPath(workspaceDir)

  const syncStatusBarItem = Locator('.StatusBarItem[name="git.sync"]')
  await expect(syncStatusBarItem).toBeVisible()
  await expect(syncStatusBarItem).toHaveText('2↓ 0↑')
  await expect(syncStatusBarItem).toHaveAttribute('aria-label', 'second-workspace (Git) - Pull 2 commits from origin/main')
}
