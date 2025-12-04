import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.push-error-no-configured-push-destination'

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Workspace }) => {
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
