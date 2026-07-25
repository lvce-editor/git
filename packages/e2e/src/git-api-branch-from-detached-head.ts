import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-from-detached-head'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'main')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.createTag('v1')
  await Git.checkout('v1')

  await Git.branch('from-tag')

  const tagRef = await FileSystem.readFile(`${tmpDir}/.git/refs/tags/v1`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/from-tag`, tagRef)
}
