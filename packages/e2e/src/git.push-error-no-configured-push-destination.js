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

test('git.push-error-no-configured-push-destination', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await createFakeGitBinary(`
console.error(\`fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

\`)
process.exit(128)
`)
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
