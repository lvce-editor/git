import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.set-config-empty-value'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Previous User')

  await Git.setConfig('user.name', '')

  const config = await FileSystem.readFile(`${tmpDir}/.git/config`)
  if (config.includes('Previous User')) {
    throw new Error('expected empty config value to replace previous value')
  }
  if (!config.includes('name =')) {
    throw new Error('expected user.name key to remain configured')
  }
}
