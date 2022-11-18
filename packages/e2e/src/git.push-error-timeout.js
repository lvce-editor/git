test.skip('git.push-error-timeout', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.push-error-timeout/git.js`
  )
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')
  // assert
  // TODO after a fixed amount of time, should show a message that command is running too long
  // with a cancel button

  // TODO background operations like git fetch in the background should not show timeout error when they fail
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, maybe something like Git operations was canceled after 3 seconds
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git push timeout out after 3000ms'
  )
})

export {}
