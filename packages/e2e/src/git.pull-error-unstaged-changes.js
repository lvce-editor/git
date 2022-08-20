test('git.pull-error-unstaged-changes', async () => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  // arrange
  const gitPath = await FileSystem.createExecutable(`
console.error(\`error: Cannot pull with rebase, you have unstaged changes.
error: please commit or stash them.\`)
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
  // TODO remove error prefix from error
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: error: Cannot pull with rebase, you have unstaged changes.'
  )
})

export {}
