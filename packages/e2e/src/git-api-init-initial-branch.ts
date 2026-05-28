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
  const headContent = await FileSystem.readFile(`${tmpDir}/.git/HEAD`)
  if (headContent !== `ref: refs/heads/${initialBranch}\n`) {
    throw new Error(`expected HEAD to point to ${initialBranch}, got ${headContent}`)
  }
  await FileSystem.shouldHaveFolder(`${tmpDir}/.git/refs/heads`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init', '--initial-branch', initialBranch],
      cwd: tmpDir,
    },
  ])
}
