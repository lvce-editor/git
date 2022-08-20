test('git.pull-error-not-a-git-repository', async () => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  // arrange
  const gitPath = await FileSystem.createExecutable(`
console.error("fatal: not a git repository (or any of the parent directories): .git")
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
  const notification = Locator('#DialogBodyErrorMessage')
  await expect(notification).toHaveText(
    'Error: Git: fatal: not a git repository (or any of the parent directories): .git'
  )
})

export {}
