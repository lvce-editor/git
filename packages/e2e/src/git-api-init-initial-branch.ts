import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-initial-branch'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const initialBranch = 'feature'

  await Workspace.setPath(tmpDir)

  // act
  await Git.init({
    initialBranch,
  })

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/HEAD`, `ref: refs/heads/${initialBranch}\n`)
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git/refs/heads`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init', '--initial-branch', initialBranch],
      cwd: tmpDir,
    },
  ])
}
