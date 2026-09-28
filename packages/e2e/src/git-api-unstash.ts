import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.unstash'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setUri(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-stash')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setUri(workspaceDir)
  await Git.stash()

  // act
  await Git.unstash()

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'modified content')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'stash', 'push'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
    {
      command: ['git', 'stash', 'pop'],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
