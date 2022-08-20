const createFakeGitBinary = async (content) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const nodePath = await Platform.getNodePath()
  const gitPath = `${tmpDir}/git`
  await FileSystem.writeFile(
    gitPath,
    `#!${nodePath}
${content}`
  )
  await FileSystem.chmod(gitPath, '755')
  return gitPath
}

test('git.push-error-timeout', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await createFakeGitBinary(`setTimeout(()=>{}, 9999999)`)
  const configDir = await Settings.update({
    'git.path': gitPath,
  })

  // act
  await Command.execute('git.push')

  // assert
  // TODO after a fixed amount of time, should show a message that command is running too long
  // with a cancel button

  // TODO background operations like git fetch in the background should not show timeout error when they fail
  const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, maybe something like Git operations was canceled after 3 seconds
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git push timeout out after 3000ms'
  )
})

export {}
