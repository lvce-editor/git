import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.cherry-pick-multiple-files'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/base.txt`, 'base')
  await Git.add('base.txt')
  await Git.commit('base')
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.setFiles([
    { content: 'first', uri: `${tmpDir}/first.txt` },
    { content: 'second', uri: `${tmpDir}/second.txt` },
  ])
  await Git.addAll()
  await Git.commit('add two files')
  const featureRefRaw = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/feature`)
  const featureRef = featureRefRaw.trim()
  await Git.checkout('main')

  await Git.cherryPick(featureRef)

  await FileSystem.shouldHaveFile(`${tmpDir}/first.txt`, 'first')
  await FileSystem.shouldHaveFile(`${tmpDir}/second.txt`, 'second')
  await Git.shouldHaveCommit('add two files')
}
