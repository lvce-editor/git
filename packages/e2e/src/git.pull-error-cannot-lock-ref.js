export const skip=true

export const name = 'git.pull-error-cannot-lock-ref'

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
        stdout: '',
        stderr: `error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5
! 70ea06a46f..2e4bfdb24f  master     -> origin/master  (unable to update local ref)`,
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

export const test = async ({
  FileSystem,
  Workspace,
  QuickPick,
  Locator,
  expect,
}) => {
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
  await expect(dialogErrorMessage).toHaveText(
    `Error: Git: error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5`
  )
}
