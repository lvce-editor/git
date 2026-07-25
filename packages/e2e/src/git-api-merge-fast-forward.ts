import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge-fast-forward'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'base')
  await Git.add(fileName)
  await Git.commit('base')
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'feature')
  await Git.add(fileName)
  await Git.commit('feature change')
  await Git.checkout('main')

  await Git.merge('feature')

  const featureRef = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/feature`)
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/main`, featureRef)
  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'feature')
}
