// @ts-ignore

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-spinning.clean'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')

  // act
  await Settings.update({
    'git.path': 'git',
  })

  // Open quick pick and execute git sync
  await QuickPick.executeCommand('Git: Sync')

  // assert
  const statusBarItemSync = Locator('.StatusBarItem[data-name="sync head"]')
  const statusBarItemSyncIcon = statusBarItemSync.locator('.StatusBarIcon')
  await expect(statusBarItemSyncIcon).toBeVisible()
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon AnimationSpin')

  // Wait for animation to complete
  // @ts-ignore
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon', {
    timeout: 10_000,
  })
}
