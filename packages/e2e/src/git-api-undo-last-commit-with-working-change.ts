import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-last-commit-with-working-change'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'first')
  await Git.add(fileName)
  await Git.commit('first')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'second')
  await Git.add(fileName)
  await Git.commit('second')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'working change')

  await Git.undoLastCommit()

  await Git.shouldHaveCommit('first')
  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'working change')
}
