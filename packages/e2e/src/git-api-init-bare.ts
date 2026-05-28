import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.init-bare'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await Git.init({
    bare: true,
  })

  // assert
  const headContent = await FileSystem.readFile(`${tmpDir}/HEAD`)
  if (headContent !== 'ref: refs/heads/main\n') {
    throw new Error(`expected bare HEAD to point to main, got ${headContent}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/config`, `[core]
\trepositoryformatversion = 0
\tfilemode = true
\tbare = true
\tlogallrefupdates = false
\tignorecase = true
\tprecomposeunicode = true
`)
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
