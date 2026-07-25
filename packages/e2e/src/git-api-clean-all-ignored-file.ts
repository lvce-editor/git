import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.clean-all-ignored-file'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const ignoredFile = 'debug.log'

  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, '*.log\n')
  await Git.add('.gitignore')
  await Git.commit('add gitignore')
  await FileSystem.writeFile(`${tmpDir}/${ignoredFile}`, 'ignored')

  await Git.cleanAll()

  await FileSystem.shouldHaveFile(`${tmpDir}/${ignoredFile}`, 'ignored')
}
