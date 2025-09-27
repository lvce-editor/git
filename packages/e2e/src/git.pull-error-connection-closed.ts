import type { Test } from '@lvce-editor/test-with-playwright'
// @ts-ignore

export const skip = true

export const name = 'git.pull-error-connection-closed'

export const test: Test = async ({ FileSystem, Workspace, Settings, QuickPick, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.pull-error-connection-closed/git.js`)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.executeCommand('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText('Error: Git: Connection closed by 0.0.0.0 port 22')
}
