import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.executeExtensionCommand('git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.branch('feature')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/feature`, mainRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'main branch')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
