import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.delete-tag-unicode'

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const tag = '发布-一'
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.createTag(tag)

  await Git.deleteTag(tag)

  const tags = await FileSystem.readDir(`${workspaceDir}/.git/refs/tags`)
  if (tags.some((entry) => entry.name === tag)) {
    throw new Error('expected unicode tag to be deleted')
  }
}
