import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'git.pull-error-not-a-git-repository'

const exec = (command: string, args: string[], options: any) => {
  if (command === 'git') {
    if (args[0] === '--version') {
      return {
        exitCode: 0,
        stderr: '',
        stdout: '0.0.0',
      }
    }
    if (args[0] === 'pull') {
      return {
        exitCode: 128,
        stderr: 'fatal: not a git repository (or any of the parent directories): .git',
        stdout: '',
      }
    }
  }
  throw new Error(`unexpected command ${command}`)
}

export const mockRpc = {
  commands: {
    'Exec.exec': exec,
  },
  name: 'Git',
}

export const test: Test = async ({ expect, FileSystem, Locator, QuickPick, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Pull')
  await QuickPick.selectItem('Git: Pull')

  // assert
  const notification = Locator('#DialogBodyErrorMessage')
  await expect(notification).toHaveText('Error: Git: fatal: not a git repository (or any of the parent directories): .git')
}
