import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.pull-error-cannot-fast-forward-multiple-branches'

export const mockRpc = await createGitMockRpc('pull-error-cannot-fast-forward-multiple-branches')

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO remove error prefix from error
  await expect(dialogErrorMessage).toHaveText('Error: Git: fatal: Cannot fast-forward to multiple branches.')
}
