import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstage-all-clean-repository'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.unstageAll')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--staged', '.'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
