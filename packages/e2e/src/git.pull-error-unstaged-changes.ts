import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'git.pull-error-unstaged-changes'

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
        stderr: `error: Cannot pull with rebase, you have unstaged changes.
error: please commit or stash them.
`,
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
  const dialogErrorMessage = Locator('#DialogBodyErrorMessage')
  await expect(dialogErrorMessage).toBeVisible()
  // TODO remove error prefix from error
  await expect(dialogErrorMessage).toHaveText('Error: Git: error: Cannot pull with rebase, you have unstaged changes.')
}
