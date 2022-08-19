const createFakeGitBinary = async (content) => {
  const tmpDir = await FileSystem.getTmpDir()
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

test('git.pull-error-not-possible-fast-forward-aborting', async () => {
  // arrange
  const gitPath = await createFakeGitBinary(`
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
  await Command.execute('git.pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: fatal: Not possible to fast-forward, aborting.'
  )
})

export {}
