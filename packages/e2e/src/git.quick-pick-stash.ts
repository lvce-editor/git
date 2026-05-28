import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-stash'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Stash')
  await QuickPick.selectItem('Git: Stash')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'initial content')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: workspaceDir,
    },
  ])
}
