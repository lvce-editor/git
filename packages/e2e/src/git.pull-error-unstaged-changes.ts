import type { Test } from '@lvce-editor/test-with-playwright'

export const skip = true

export const name = 'git.pull-error-unstaged-changes'

const exec = (command: string, args: string[], options: any) => {
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
        stderr: `error: Cannot pull with rebase, you have unstaged changes.
error: please commit or stash them.
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

export const test: Test = async ({ FileSystem, Workspace, QuickPick, Locator, expect }) => {
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
