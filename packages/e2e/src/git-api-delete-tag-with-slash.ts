import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.delete-tag-with-slash'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const tagName = 'releases/v1'

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'tagged')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.createTag(tagName)

  await Git.deleteTag(tagName)

  await Git.createTag(tagName)
  const mainRef = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/tags/${tagName}`, mainRef)
}
