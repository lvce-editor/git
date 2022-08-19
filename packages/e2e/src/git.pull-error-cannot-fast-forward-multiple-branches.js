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

test('git.pull-error-cannot-fast-forward-multiple-branches', async () => {
  // arrange
  const gitPath = await createFakeGitBinary(`
console.error("fatal: Cannot fast-forward to multiple branches.")
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
  // TODO remove error prefix from error
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: fatal: Cannot fast-forward to multiple branches.'
  )
})

export {}
