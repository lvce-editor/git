import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-tag-dot-name'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const tag = 'release.2026.1'
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)

  await Git.createTag(tag)

  const head = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/tags/${tag}`, head)
}
