import { createGitMockRpc } from './test-helpers/gitMockHelper.js'
import type { TestContext } from '../typings/e2e-types.js'
import type { Test } from '@lvce-editor/test-with-playwright'

export const mockRpc = await createGitMockRpc('sync-spinning-internal-server-error')

export const test: Test = async ({ FileSystem, Workspace, Settings, Locator, expect }: TestContext) => {
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
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  await expect(dialogErrorMessage).toHaveText('Error: Git: remote: Internal Server Error')
}
