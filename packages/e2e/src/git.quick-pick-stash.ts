import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-stash'

const waitForFileContent = async (FileSystem: { readFile: (uri: string) => Promise<string> }, uri: string, expected: string): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    const actual = await FileSystem.readFile(uri)
    if (actual === expected) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const actual = await FileSystem.readFile(uri)
  throw new Error(`expected ${uri} to be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

export const test: Test = async ({ Command, FileSystem, Git, QuickPick, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await SideBar.open('Source Control')

  // arrange
  await Git.stash()
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'initial content')

  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'second change')
  await Git.stash()

  // act
  await QuickPick.open()
  await QuickPick.setValue('>pop latest')
  await QuickPick.selectItem('Git: Pop Latest Stash')

  // assert
  await waitForFileContent(FileSystem, `${workspaceDir}/file.txt`, 'second change')

  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'initial content')
  await Command.execute('ExtensionHost.executeCommand', 'git.applyStash', { stashReference: 'stash@{0}' })
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')

  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'stash', 'push'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'stash', 'pop'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'stash', 'apply', 'stash@{0}'],
      cwd: workspaceDir,
    },
  ])
}
