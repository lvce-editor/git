export const name = 'git.pull-error-connection-closed-show-output'

export const skip = true

const trimLines = (string) => {
  return string.split('\n').join('')
}

export const test = async ({
  FileSystem,
  Workspace,
  Settings,
  QuickPick,
  Locator,
  expect,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.pull-error-connection-closed-show-output/git.js`
  )
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')
  // assert
  const dialog = Locator('dialog')
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: Connection closed by 0.0.0.0 port 22'
  )

  // act
  const buttonShowCommandOutput = dialog.locator('button', {
    hasText: 'Show Command Output',
  })
  await buttonShowCommandOutput.click()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    trimLines(`Connection closed by 0.0.0.0 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.`)
  )
}
