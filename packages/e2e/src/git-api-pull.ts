import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.pull'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-pull')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.pull('origin', 'main')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'version 2')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'pull'],
      cwd: workspaceDir,
    },
  ])
}
