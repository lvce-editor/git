import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-last-commit'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-undo-last-commit')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.undoLastCommit')

  // assert
  const taggedRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/before-undo`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/main`, taggedRef)
  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'second version')
  const indexContent = await FileSystem.readFile(`${workspaceDir}/.git/index`)
  if (!indexContent.includes('file.txt')) {
    throw new Error(`expected undone commit changes to remain staged, got ${indexContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'reset', '--soft', 'HEAD~1'],
      cwd: workspaceDir,
    },
  ])
}
