test.skip('git.show-changed-files-in-side-bar', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.show-changed-files-in-side-bar/git.js`
  )
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await SideBar.open('Source Control')

  // assert

  // TODO check that changed files are shown
})
