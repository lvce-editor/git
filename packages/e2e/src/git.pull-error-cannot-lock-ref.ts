import type { Test } from '@lvce-editor/test-with-playwright'
import { createGitMockRpc } from './test-helpers/gitMockHelper.js'

export const skip = true

export const name = 'git.pull-error-cannot-lock-ref'

export const mockRpc = await createGitMockRpc('pull-error-cannot-lock-ref')

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText(
    `Error: Git: error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5`,
  )
}
