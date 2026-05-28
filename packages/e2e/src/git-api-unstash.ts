import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.stash')

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.unstash')

  // assert
  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'modified content') {
    throw new Error(`expected stashed changes to be restored, got ${fileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'stash', 'pop'],
      cwd: workspaceDir,
    },
  ])
}
