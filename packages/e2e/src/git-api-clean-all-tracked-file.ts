import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clean-all-tracked-file'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'modified content')

  // act
  await Git.cleanAll()

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--', '.'],
      cwd: workspaceDir,
    },
    {
      command: ['git', 'clean', '-fd'],
      cwd: workspaceDir,
    },
  ])
}
