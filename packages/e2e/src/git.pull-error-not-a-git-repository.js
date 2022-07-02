import { expect } from '@playwright/test'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'
import {
  runWithExtension,
  root,
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
console.error("fatal: not a git repository (or any of the parent directories): .git")
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
  const token = page.locator('.Token.Text')
  await token.click()
  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  const quickPickInput = quickPick.locator('.InputBox')
  await quickPickInput.type('git pull')
  const quickPickItemOne = page.locator('#QuickPickItem-0')
  await quickPickItemOne.click()
  if (useElectron) {
    // TODO
  } else {
    const notification = await page.waitForSelector('.Notification')
    const notificationText = await notification.textContent()
    if (
      notificationText !==
      'GitError: Git: fatal: not a git repository (or any of the parent directories): .git'
    ) {
      console.log({ notificationText })
      return
    }
  }
  if (process.send) {
    process.send('succeeded')
  }
}

main()
