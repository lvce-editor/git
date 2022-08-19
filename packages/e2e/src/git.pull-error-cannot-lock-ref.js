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

test('git.pull-error-cannot-lock-ref', async () => {
  // arrange
  const gitPath = await createFakeGitBinary(`
console.error(\`error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5
! 70ea06a46f..2e4bfdb24f  master     -> origin/master  (unable to update local ref)\`)
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
    `Error: Git: error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5`
  )
})

export {}
