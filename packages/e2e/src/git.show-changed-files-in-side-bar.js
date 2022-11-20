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
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
  await expect(treeItems.nth(0)).toHaveText('file-1.txt')
  await expect(treeItems.nth(1)).toHaveText('file-2.txt')
})
