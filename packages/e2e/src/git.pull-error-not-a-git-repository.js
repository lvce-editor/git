export const name = 'git.pull-error-not-a-git-repository'

export const skip = true

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
        stderr:
          'fatal: not a git repository (or any of the parent directories): .git',
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
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
  const notification = Locator('#DialogBodyErrorMessage')
  await expect(notification).toHaveText(
    'Error: Git: fatal: not a git repository (or any of the parent directories): .git'
  )
}
