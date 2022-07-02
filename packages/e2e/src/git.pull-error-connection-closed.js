import { expect } from '@playwright/test'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'
import {
  runWithExtension,
  useElectron,
  writeSettings,
} from './runWithExtension.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

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

const main = async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error(\`Connection closed by 0.0.0.0 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
\`)
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
    // TODO error message could be improved, should include full git error message
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: Connection closed by 0.0.0.0 port 22'
    )
  }
  if (process.send) {
    process.send('succeeded')
  }
}

main()
