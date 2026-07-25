import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stash-staged-change'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'initial')
  await Git.add(fileName)
  await Git.commit('initial')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'staged change')
  await Git.add(fileName)

  await Git.stash()

  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'initial')
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git/refs`)
  const stashRef = await FileSystem.readFile(`${tmpDir}/.git/refs/stash`)
  if (!stashRef.trim()) {
    throw new Error('expected stash ref')
  }
}
