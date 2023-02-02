export const name =
  'git.pull-error-kex-exchange-identification-connection-closed'

export const mockExec = (command, args, options) => {
  if (command === 'git') {
    if (args[0] === '--version') {
      return {
        stdout: '0.0.0',
        stderr: '',
        exitCode: 0,
      }
    }
    if (args[0] === 'pull') {
      return {
        stdout: '',
        stderr: `kex_exchange_identification: Connection closed by remote host
Connection closed by 0000:0000:0000::0000:0000 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
`,

        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

export const test = async ({
  FileSystem,
  Workspace,
  Settings,
  QuickPick,
  Locator,
  expect,
}) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutableFrom(
    `fixtures/git.pull-error-kex-exchange-identification-connection-closed/git.js`
  )
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
}
