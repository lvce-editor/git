export const skip = true

export const name = 'git.push-error-no-configured-push-destination'

const exec = (command, args, options) => {
  if (command === 'git') {
    if (args[0] === '--version') {
      return {
        stdout: '0.0.0',
        stderr: '',
        exitCode: 0,
      }
    }
    if (args[0] === 'push') {
      return {
        stdout: '',
        stderr: `fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

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
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO remove error prefix from error
  // TODO improve error message

  await expect(dialogErrorMessage).toHaveText('Error: Git: fatal: No configured push destination.')
}
