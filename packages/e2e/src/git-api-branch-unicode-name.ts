import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.branch-unicode-name'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const branchName = '功能分支'

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'main')
  await Git.add('file.txt')
  await Git.commit('initial')

  await Git.branch(branchName)
  await Git.checkout(branchName)

  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, `ref: refs/heads/${branchName}\n`)
}
