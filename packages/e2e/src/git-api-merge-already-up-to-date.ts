import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge-already-up-to-date'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'unchanged')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.branch('feature')

  await Git.merge('feature')

  const mainRef = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/feature`, mainRef)
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'unchanged')
}
