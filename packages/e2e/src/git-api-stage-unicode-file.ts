import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-unicode-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'résumé-文件.txt'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await FileSystem.writeFile(`${tmpDir}/${fileName}`, 'unicode content')

  await Git.stage(fileName)

  const indexContent = await FileSystem.readFile(`${tmpDir}/.git/index`)
  if (!indexContent.includes(fileName)) {
    throw new Error(`expected ${fileName} in git index`)
  }
}
