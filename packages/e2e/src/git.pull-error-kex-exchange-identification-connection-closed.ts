import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.pull-error-kex-exchange-identification-connection-closed'

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText('Error: Git: kex_exchange_identification: Connection closed by remote host')
}
