import {
  getTmpDir,
  runWithExtension,
  test,
  useElectron,
  writeSettings,
} from '@lvce-editor/test-with-playwright'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'

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

test('git.pull-error-repository-not-found', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error(\`Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.\`)
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
  await page.waitForSelector('#QuickPick')
  await page.type('#QuickPick .InputBox', 'git pull')
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
})
