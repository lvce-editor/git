// TODO this code is duplcated in many files, have a shared file that exports this function

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

test('git.pull-error-kex-exchange-identification-connection-closed', async () => {
  const gitPath = await createFakeGitBinary(`
console.error(\`kex_exchange_identification: Connection closed by remote host
Connection closed by 0000:0000:0000::0000:0000 port 22
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
  const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: kex_exchange_identification: Connection closed by remote host'
  )
})

export {}
