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
        stderr: 'fatal: Cannot fast-forward to multiple branches.',
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

test('git.pull-error-cannot-fast-forward-multiple-branches', async () => {
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
  // TODO remove error prefix from error
  await expect(dialogErrorMessage).toHaveText(
    'Error: Git: fatal: Cannot fast-forward to multiple branches.'
  )
})

export {}
