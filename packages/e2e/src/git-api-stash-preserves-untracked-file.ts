import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stash-preserves-untracked-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/tracked.txt`, 'initial')
  await Git.add('tracked.txt')
  await Git.commit('initial')
  await FileSystem.setFiles([
    { content: 'modified', uri: `${tmpDir}/tracked.txt` },
    { content: 'untracked', uri: `${tmpDir}/untracked.txt` },
  ])

  await Git.stash()

  await FileSystem.shouldHaveFile(`${tmpDir}/tracked.txt`, 'initial')
  await FileSystem.shouldHaveFile(`${tmpDir}/untracked.txt`, 'untracked')
}
