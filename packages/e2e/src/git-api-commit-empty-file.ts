import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-empty-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/empty.txt`, '')
  await Git.add('empty.txt')

  await Git.commit('add empty file')

  await Git.shouldHaveCommit('add empty file')
  await FileSystem.shouldHaveFile(`${tmpDir}/empty.txt`, '')
}
