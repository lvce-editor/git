import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-directory'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.mkdir(`${tmpDir}/docs`)
  await FileSystem.setFiles([
    { content: '# Guide', uri: `${tmpDir}/docs/guide.md` },
    { content: 'outside', uri: `${tmpDir}/outside.txt` },
  ])

  await Git.stage('docs')

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes('docs/guide.md') || index.includes('outside.txt')) {
    throw new Error('expected only the selected directory to be staged')
  }
}
