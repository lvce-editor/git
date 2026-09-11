import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.quick-pick-commit'

export const test: Test = async ({ Command, expect, FileSystem, Git, KeyBoard, Locator, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-checkout'))
  const workspaceDir = `${tmpDir}/workspace`
  await Workspace.setPath(workspaceDir)
  await Git.checkout('feature')
  await FileSystem.writeFile(`${workspaceDir}/file.txt`, 'another change')
  await Git.stage('file.txt')
  const originalRef = await FileSystem.readFile(`${workspaceDir}/.git/refs/heads/feature`)

  await QuickPick.open()
  await QuickPick.setValue('>Git: Commit')
  await QuickPick.selectItem('Git: Commit', { waitUntil: 'none' })
  const input = Locator('input[name="QuickPickInput"][placeholder="Commit message"]')
  await expect(input).toBeVisible()
  await expect(input).toBeFocused()
  await KeyBoard.press('Escape')
  await expect(input).toBeHidden()
  await FileSystem.shouldHaveFile(`${workspaceDir}/.git/refs/heads/feature`, originalRef)

  await QuickPick.open()
  await QuickPick.setValue('>Git: Commit')
  await QuickPick.selectItem('Git: Commit', { waitUntil: 'none' })
  await expect(input).toBeVisible()
  await input.type('Second feature commit')
  await KeyBoard.press('Enter')
  await expect(input).toBeHidden()
  await Git.shouldHaveInvocations([{ command: ['git', 'commit', '-m', 'Second feature commit'], cwd: workspaceDir }])
  const commits = (await Command.execute('ExtensionHost.executeCommand', 'git.getCommits')) as readonly { readonly message: string }[]
  if (commits[0]?.message !== 'Second feature commit') {
    throw new Error(`Unexpected commits: ${JSON.stringify(commits)}`)
  }
}
