import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-tag-unicode-name'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const tagName = '版本-一'

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'tagged')
  await Git.add('file.txt')
  await Git.commit('initial')

  await Git.createTag(tagName)

  const mainRef = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/tags/${tagName}`, mainRef)
}
