import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout'

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
  const headContent = await FileSystem.readFile(`${workspaceDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/feature\n') {
    throw new Error(`expected HEAD to point to feature, got ${headContent}`)
  }
  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'feature branch') {
    throw new Error(`expected feature branch content, got ${fileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'checkout', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
