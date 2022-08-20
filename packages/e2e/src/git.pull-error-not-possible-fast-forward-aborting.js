test('git.pull-error-not-possible-fast-forward-aborting', async () => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  // arrange
  const gitPath = await FileSystem.createExecutable(`
console.error(\`From github.com:user/repo
* branch                      main       -> FETCH_HEAD
fatal: Not possible to fast-forward, aborting.
\`)
process.exit(128)
`)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: fatal: Not possible to fast-forward, aborting.'
  )
})

export {}
