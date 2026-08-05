import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-dot-pathspec'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.setFiles([
    { content: 'one', uri: `${tmpDir}/one.txt` },
    { content: 'two', uri: `${tmpDir}/two.txt` },
  ])

  await Git.stage('.')

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes('one.txt') || !index.includes('two.txt')) {
    throw new Error('expected dot pathspec to stage all files')
  }
}
