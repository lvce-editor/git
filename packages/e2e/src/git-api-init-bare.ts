import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-bare'

export const skip = 1

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await Git.init({
    bare: true,
  })

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/HEAD`, 'ref: refs/heads/main\n')
  const configContent = await FileSystem.readFile(`${tmpDir}/config`)
  if (!configContent.includes('bare = true')) {
    throw new Error(`expected bare config to contain bare = true, got ${configContent}`)
  }
  await FileSystem.shouldHaveFolder(`${tmpDir}/refs`)
  await FileSystem.shouldHaveFolder(`${tmpDir}/refs/heads`)
  await FileSystem.shouldHaveFolder(`${tmpDir}/refs/tags`)
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'init', '--bare'],
      cwd: tmpDir,
    },
  ])
}
