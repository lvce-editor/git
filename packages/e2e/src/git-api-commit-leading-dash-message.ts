import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.commit-leading-dash-message'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const message = '-- document command parsing'
  await Workspace.setPath(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(`${tmpDir}/readme.md`, '# Readme')
  await Git.add('readme.md')

  await Git.commit(message)

  await Git.shouldHaveCommit(message)
}
