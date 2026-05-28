import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge'

// export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-merge')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.merge', 'feature')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/added.txt`, 'merged content')
  const headContent = await FileSystem.readFile(`${workspaceDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected HEAD to stay on main, got ${headContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'merge', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
