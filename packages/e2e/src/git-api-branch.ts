import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`

  await Workspace.setPath(tmpDir)
  const fixtureUrl = import.meta.resolve('../fixtures/git-api-branch')
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', fixtureUrl)
  await Workspace.setPath(workspaceDir)

  // act
  await Git.branch('feature')

  // assert
  const headContent = await FileSystem.readFile(`${workspaceDir}/.git/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected HEAD to stay on main, got ${headContent}`)
  }
  const mainRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  const featureRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)
  if (featureRef !== mainRef) {
    throw new Error(`expected feature branch ref to match main, got ${featureRef}`)
  }
  const fileContent = await FileSystem.readFile(`${workspaceDir}/file.txt`)
  if (fileContent !== 'main branch') {
    throw new Error(`expected main branch content, got ${fileContent}`)
  }
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'branch', 'feature'],
      cwd: workspaceDir,
    },
  ])
}
