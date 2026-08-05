import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.stash-unicode-message'

export const test: Test = async ({ Command, FileSystem, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const message = '保存进行中的工作'
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-stash'))
  await Workspace.setPath(workspaceDir)

  await Command.execute('ExtensionHost.executeCommand', 'git.stash', { message })

  await FileSystem.shouldHaveFile(`${workspaceDir}/file.txt`, 'initial content')
  const stashLog = await FileSystem.readFile(`${workspaceDir}/.git/logs/refs/stash`)
  if (!stashLog.includes(message)) {
    throw new Error('expected unicode stash message in stash log')
  }
}
