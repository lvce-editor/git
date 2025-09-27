import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-spinning-internal-server-error'

export const skip = true

export const test: Test = async ({ Workspace, FileSystem, Settings }) => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await createFakeGitBinary(`
console.info(\`Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.\`)
console.error(\`remote: Internal Server Error
To github.com:user/repo.git
 ! [remote rejected]           main -> main (Internal Server Error)
error: failed to push some refs to 'github.com:user/repo.git\`)
process.exit(128)
`)
  const configDir = await writeSettings({
    'git.path': gitPath,
  })
  const page = await runWithExtension({
    name: 'builtin.git',
    folder: tmpDir,
    env: {
      XDG_CONFIG_HOME: configDir,
    },
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text')
  await tokenText.click()
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInput = quickPick.locator('.InputBox')
  await expect(quickPickInput).toHaveValue('>')
  await quickPickInput.type('git sync')
  const quickPickItemGitSync = quickPick.locator('text=Git: Sync')
  await quickPickItemGitSync.click()

  if (useElectron) {
    // TODO
  } else {
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, vscode has very good/short git error messages
    await expect(dialogErrorMessage).toHaveText('Error: Git: remote: Internal Server Error')
  }
}

