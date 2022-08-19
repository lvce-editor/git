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

test('git.pull-error-repository-not-found', async () => {
  // arrange
  const gitPath = await createFakeGitBinary(`
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
  await Command.execute('git.pull')

  // assert
  const notification = await Locator('.Notification')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveText(
    'GitError: Git: fatal: not a git repository (or any of the parent directories): .git'
  )
})

export {}
