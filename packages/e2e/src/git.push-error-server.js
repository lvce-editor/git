test('git.push-error-server', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.push-error-server/git.js`
  )
  await Settings.update({
    'git.path': gitPath,
  })

  // TODO have a faster way to execute commands as user, no need to open quick pick
  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')
  // assert
  // if (useElectron) {
  //   // TODO
  // } else {
  //   const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
  //   await expect(dialogErrorMessage).toBeVisible()
  //   // TODO error message could be improved, vscode has very good/short git error messages
  //   await expect(dialogErrorMessage).toHaveText(
  //     'Error: Git: remote: Internal Server Error'
  //   )
  // }
})

export {}
