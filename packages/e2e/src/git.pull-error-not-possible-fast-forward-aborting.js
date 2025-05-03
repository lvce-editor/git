export const skip = true

export const name = 'git.pull-error-not-possible-fast-forward-aborting'

const exec = (command, args, options) => {
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
        stdout: `From github.com:user/repo
* branch                      main       -> FETCH_HEAD`,
        stderr: `fatal: Not possible to fast-forward, aborting.
`,
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

export const mockRpc = {
  name: 'Git',
  commands: {
    'Exec.exec': exec,
  },
}

export const test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText('Error: Git: fatal: Not possible to fast-forward, aborting.')
}
