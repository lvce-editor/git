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
        stderr: `Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.`,
        exitCode: 128,
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

test('git.pull-error-repository-not-found', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')

  // assert
  const notification = await Locator('#DialogBodyErrorMessage')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveText('Error: Git: Repository not found.')
})

export {}
