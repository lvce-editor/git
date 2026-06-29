import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.push-follow-tags'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const tagName = 'v0.1'

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-push-follow-tags')
  await Command.executeExtensionCommand('git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.push', {
    followTags: true,
    setUpstream: ['origin', 'main'],
  })

  // assert
  const localTagRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/${tagName}`)
  const remoteTagRef = await FileSystem.readFile(`${tmpDir}/remote.git/refs/tags/${tagName}`)
  if (remoteTagRef !== localTagRef) {
    throw new Error(`expected remote tag ref to match local tag ref, got ${remoteTagRef}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'push', '--porcelain', '--follow-tags', '--set-upstream', 'origin', 'main'],
      cwd: workspaceDir,
    },
  ])
}
