import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  useElectron,
  writeSettings,
} from '@lvce-editor/test-with-playwright'
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

test('git.pull-error-cannot-lock-ref', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error(\`error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5
! 70ea06a46f..2e4bfdb24f  master     -> origin/master  (unable to update local ref)\`)
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
  await quickPickInput.type('git pull')
  const quickPickItemGitPull = quickPick.locator('text=Git: Pull').first()
  await quickPickItemGitPull.click()

  if (useElectron) {
    // TODO
  } else {
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, vscode has very good/short git error messages
    await expect(dialogErrorMessage).toHaveText(
      `Error: Git: error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5`
    )
  }
})
