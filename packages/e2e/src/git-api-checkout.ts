import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-checkout')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.checkout('feature')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/feature\n')
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'feature branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'checkout', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
