import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.pull-error-divergent-branches'

export const test: Test = async ({ Command, Extension, FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension('../fixtures/mock-git-exec')
  await Command.execute('mock-exec.setup', 'pull-error-divergent-branches')

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText('Error: Git: hint: You have divergent branches and need to specify how to reconcile them.')
}
