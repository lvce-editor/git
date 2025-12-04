import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.pull-error-offline'

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText('Error: Git: ssh: Could not resolve hostname github.com: Temporary failure in name resolution')
}
