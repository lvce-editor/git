import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-remote'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const remoteName = 'backup'
  const remoteUrl = 'https://example.com/repository.git'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.addRemote(remoteName, remoteUrl)

  // assert
  const configContent = await FileSystem.readFile(`${workspaceDir}/.git/config`)
  if (!configContent.includes(`[remote "${remoteName}"]`) || !configContent.includes(`url = ${remoteUrl}`)) {
    throw new Error(`expected git config to contain ${remoteName} remote, got ${configContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'remote', 'add', remoteName, remoteUrl],
      cwd: workspaceDir,
    },
  ])
}
