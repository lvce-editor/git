import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-last-commit-new-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/base.txt`, 'base')
  await Git.add('base.txt')
  await Git.commit('initial')
  const initialRef = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/main`)
  await FileSystem.writeFile(`${tmpDir}/new.txt`, 'new content')
  await Git.add('new.txt')
  await Git.commit('add new file')

  await Git.undoLastCommit()

  await FileSystem.shouldHaveFile(`${tmpDir}/new.txt`, 'new content')
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/refs/heads/main`, initialRef)
  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes('new.txt')) {
    throw new Error('expected new file to remain staged after undo')
  }
}
