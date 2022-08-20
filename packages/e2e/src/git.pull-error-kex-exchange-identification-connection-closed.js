test('git.pull-error-kex-exchange-identification-connection-closed', async () => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutable(`
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
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, should include full git error message
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: kex_exchange_identification: Connection closed by remote host'
  )
})

export {}
