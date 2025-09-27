import { createGitMockRpc } from './test-helpers/gitMockHelper.js'
import type { TestContext } from '../typings/e2e-types.js'
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-spinning.clean'

export const mockRpc = await createGitMockRpc('sync-spinning')

export const test: Test = async ({ FileSystem, Workspace, Settings, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')

  // act
  await Settings.update({
    'git.path': 'git',
  })

  // Open quick pick and execute git sync
  const quickPick = Locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await quickPickInput.type('git sync')
  const quickPickItemGitSync = quickPick.locator('text=Git: Sync')
  await quickPickItemGitSync.click()

  // assert
  const statusBarItemSync = Locator('.StatusBarItem[data-name="sync head"]')
  const statusBarItemSyncIcon = statusBarItemSync.locator('.StatusBarIcon')
  await expect(statusBarItemSyncIcon).toBeVisible()
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon AnimationSpin')

  // Wait for animation to complete
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon', {
    timeout: 10_000,
  })
}
