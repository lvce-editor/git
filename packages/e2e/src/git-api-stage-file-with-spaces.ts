import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-file-with-spaces'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'release notes.txt'
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'notes')

  await Git.stage(fileName)

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes(fileName)) {
    throw new Error('expected filename with spaces to be staged')
  }
}
