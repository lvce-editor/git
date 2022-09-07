test.skip('git.commit', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(`fixtures/git.commit`)
  await Settings.update({
    'git.path': gitPath,
  })
  await SideBar.open('Source Control')
  const sourceControlInput = Locator('[aria-label="Source Control Input"]')
  await sourceControlInput.focus()
  await sourceControlInput.type('test message')

  // act
  // TODO should also test loading indicator
  await KeyBoard.press('Control+Enter')
  await expect(sourceControlInput).toHaveText('')
})

export {}
