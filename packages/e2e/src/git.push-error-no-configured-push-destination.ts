import type { Test } from '@lvce-editor/test-with-playwright'
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.push-error-no-configured-push-destination'

export const mockRpc = await createGitMockRpc('push-error-no-configured-push-destination')

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Push')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO remove error prefix from error
  // TODO improve error message

  await expect(dialogErrorMessage).toHaveText('Error: Git: fatal: No configured push destination.')
}
