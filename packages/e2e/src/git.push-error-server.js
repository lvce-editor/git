export const name = 'git.push-error-server'

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
        stdout: `Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.`,
        stderr: `remote: Internal Server Error
To github.com:user/repo.git
  ! [remote rejected]           main -> main (Internal Server Error)
error: failed to push some refs to 'github.com:user/repo.git
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

  // TODO have a faster way to execute commands as user, no need to open quick pick
  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')

  // assert
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO error message could be improved, vscode has very good/short git error messages
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: remote: Internal Server Error'
  )
}
