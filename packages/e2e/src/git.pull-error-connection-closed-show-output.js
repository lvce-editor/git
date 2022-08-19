const trimLines = (string) => {
  return string.split('\n').join('')
}

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

test('git.pull-error-connection-closed-show-output', async () => {
  const gitPath = await createFakeGitBinary(`
console.error(\`Connection closed by 0.0.0.0 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
\`)
process.exit(128)
`)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await Command.execute('git.pull')

  // assert
  const dialog = Locator('dialog')
  const dialogErrorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: Connection closed by 0.0.0.0 port 22'
  )

  // act
  const buttonShowCommandOutput = dialog.locator('button', {
    hasText: 'Show Command Output',
  })
  await buttonShowCommandOutput.click()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    trimLines(`Connection closed by 0.0.0.0 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.`)
  )
})
