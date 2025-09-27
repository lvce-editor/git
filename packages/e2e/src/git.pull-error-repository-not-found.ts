import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.pull-error-repository-not-found'

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const notification = Locator('#DialogBodyErrorMessage')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveText('Error: Git: Repository not found.')
}
