import type { Test } from '@lvce-editor/test-with-playwright'
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.push-error-email-privacy-restrictions'

export const mockRpc = await createGitMockRpc('push-error-email-privacy-restrictions')

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Push')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText('Error: Git: remote: error: GH007: Your push would publish a private email address.')
}
