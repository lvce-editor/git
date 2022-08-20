test('git.pull-error-repository-not-found', async () => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  // arrange
  const gitPath = await FileSystem.createExecutable(`
console.error(\`Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.\`)
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
  const notification = await Locator('.Notification')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveText(
    'GitError: Git: fatal: not a git repository (or any of the parent directories): .git'
  )
})

export {}
