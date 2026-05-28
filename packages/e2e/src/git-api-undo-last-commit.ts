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
  const headRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const taggedRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/tags/before-undo`)
  if (headRef !== taggedRef) {
    throw new Error(`expected HEAD to match tag before-undo, got ${headRef}`)
  }
  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'second version') {
    throw new Error(`expected working tree to keep undone commit changes, got ${fileContent}`)
  }
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
