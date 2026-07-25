import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.undo-initial-commit'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'content')
  await Git.add(fileName)
  await Git.commit('initial')

  await Git.undoLastCommit()

  await FileSystem.shouldHaveFile(`${tmpDir}/${fileName}`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, 'ref: refs/heads/main\n')
  const branches = await FileSystem.readDir(`${tmpDir}/.git/refs/heads`)
  if (branches.some((entry) => entry.name === 'main')) {
    throw new Error('expected initial branch ref to be removed')
  }
}
