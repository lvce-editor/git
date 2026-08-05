import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-directory'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.writeFile(`${tmpDir}/src/main.ts`, 'export {}')

  await Git.add('src')

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes('src/main.ts')) {
    throw new Error('expected nested file to be staged by directory pathspec')
  }
}
