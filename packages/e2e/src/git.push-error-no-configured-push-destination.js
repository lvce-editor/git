test('git.push-error-no-configured-push-destination', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.push-error-no-configured-push-destination/git.js`
  )
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO remove error prefix from error
  // TODO improve error message

  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: fatal: No configured push destination.'
  )
})

export {}
