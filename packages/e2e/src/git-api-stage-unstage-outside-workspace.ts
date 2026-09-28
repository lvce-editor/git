import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stage-unstage-outside-workspace'

export const test: Test = async ({ FileSystem, Git, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'same.txt'
  const siblingFile = `${tmpDir}/${fileName}`
  const workspaceFile = `${workspaceDir}/${fileName}`

  await Settings.update({ 'git.branchProtection': false })
  await Workspace.setUri(tmpDir)
  await Git.init()
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.mkdir(workspaceDir)
  await FileSystem.setFiles([
    {
      content: 'sibling before',
      uri: siblingFile,
    },
    {
      content: 'workspace file',
      uri: workspaceFile,
    },
  ])
  await Git.addAll()
  await Git.commit('initial')
  await FileSystem.writeFile(siblingFile, 'sibling after')

  await Workspace.setUri(workspaceDir)
  await Git.stage(fileName)
  await FileSystem.shouldHaveFile(siblingFile, 'sibling after')
  await FileSystem.shouldHaveFile(workspaceFile, 'workspace file')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'add', `:(top,literal)${fileName}`],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])

  await Git.unstage(fileName)
  await FileSystem.shouldHaveFile(siblingFile, 'sibling after')
  await FileSystem.shouldHaveFile(workspaceFile, 'workspace file')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'restore', '--staged', '--', `:(top,literal)${fileName}`],
      cwd: decodeURIComponent(new URL(workspaceDir).pathname).replace(/^\/(?=[A-Za-z]:)/, ''),
    },
  ])
}
