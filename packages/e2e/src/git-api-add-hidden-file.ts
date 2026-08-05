import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.add-hidden-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/.env.example`, 'KEY=value\n')

  await Git.add('.env.example')

  const index = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!index.includes('.env.example')) {
    throw new Error('expected hidden file to be staged')
  }
}
