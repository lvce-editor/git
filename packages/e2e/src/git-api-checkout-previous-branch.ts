import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.checkout-previous-branch'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'main')
  await Git.add('file.txt')
  await Git.commit('initial')
  await Git.branch('feature')
  await Git.checkout('feature')

  await Git.checkout('-')

  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, 'ref: refs/heads/main\n')
}
