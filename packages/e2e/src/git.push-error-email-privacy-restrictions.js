import {
  getTmpDir,
  runWithExtension,
  test,
  useElectron,
  writeSettings,
} from '@lvce-editor/test-with-playwright'
import { expect } from '@playwright/test'
import { chmod, writeFile } from 'fs/promises'
import { join } from 'node:path'

const createFakeGitBinary = async (content) => {
  const tmpDir = await getTmpDir()
  const nodePath = process.argv[0]
  const gitPath = join(tmpDir, 'git')
  await writeFile(
    gitPath,
    `#!${nodePath}
${content}`
  )
  await chmod(gitPath, '755')
  return gitPath
}

test('git.push-error-email-privacy-restrictions', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.info(\`Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.\`)
console.error(\`remote: error: GH007: Your push would publish a private email address.
To github.com:user/repo.git
 ! [remote rejected] master -> master (push declined due to email privacy restrictions)
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
  await quickPickInput.type('git push')
  const quickPickItemGitPush = quickPick.locator('text=Git: Push')
  await quickPickItemGitPush.click()

  if (useElectron) {
    // TODO
  } else {
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, vscode has very good/short git error messages
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: remote: error: GH007: Your push would publish a private email address.'
    )
  }
})
