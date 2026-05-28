import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.push'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const verifyDir = `${tmpDir}/verify`

  await Workspace.setPath(tmpDir)
  const setupFixtureUrl = import.meta.resolve('../fixtures/git-api-push')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', setupFixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.push({
    setUpstream: ['origin', 'main'],
  })

  // assert
  await Workspace.setPath(tmpDir)
  const verifyFixtureUrl = import.meta.resolve('../fixtures/git-api-push-verify')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', verifyFixtureUrl)
  const content = await FileSystem.readFile(`${verifyDir}/new-file.txt`)
  if (content !== 'pushed content') {
    throw new Error(`expected pushed content, got ${content}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'push', '--porcelain', '--set-upstream', 'origin', 'main'],
      cwd: workspaceDir,
    },
  ])
}
