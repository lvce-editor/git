import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.set-config-unicode-value'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const userName = '测试用户'
  await Workspace.setPath(tmpDir)
  await Git.init()

  await Git.setConfig('user.name', userName)

  const config = await FileSystem.readFile(`${tmpDir}/.git/config`)
  if (!config.includes(`name = ${userName}`)) {
    throw new Error('expected unicode value in git config')
  }
}
