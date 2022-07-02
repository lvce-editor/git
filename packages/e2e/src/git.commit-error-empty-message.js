import { expect } from '@playwright/test'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'
import { runWithExtension, writeSettings } from './runWithExtension.js'

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

const handleGitStatus = () => {
  console.info('')
}

const handleGitAdd = () => {
  console.error(\`On branch main
nothing to commit, working tree clean\`)
  process.exit(128)
}

switch(process.argv[2]){
  case 'status':
    handleGitStatus()
    break
  case 'add':
    handleGitAdd()
    break
  default:
    throw new Error(\`unexpected invocation \${process.argv[1]}\`)

}
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

  const activityBarItemSourceControl = page.locator('[title="Source Control"]')
  await activityBarItemSourceControl.click()

  const sourceControlInput = page.locator('[aria-label="Source Control Input"]')
  await sourceControlInput.focus()
  await page.keyboard.press('Control+Enter')

  const notification = page.locator('.Notification')
  await expect(notification).toBeVisible()
  await expect(notification).toHaveCount(1)

  const notificationMessage = notification.locator('.NotificationMessage')
  await expect(notificationMessage).toHaveText('There are no changes to commit')

  const notificationOption = notification.locator('.NotificationOption')
  await expect(notificationOption).toHaveText('Create Empty Commit')

  if (process.send) {
    process.send('succeeded')
  }
}

main()
