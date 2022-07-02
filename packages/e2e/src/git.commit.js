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
  process.exit(0)
}

const handleGitCommit = () => {
  process.exit(0)
}

const handleGitPush = () => {
  process.exit(0)
}

switch(process.argv[2]){
  case 'status':
    handleGitStatus()
    break
  case 'add':
    handleGitAdd()
    break
  case 'commit':
    handleGitCommit()
    break
  case 'push':
    handleGitPush()
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
  await sourceControlInput.type('test message')

  // TODO should also test loading indicator
  await page.keyboard.press('Control+Enter')
  await expect(sourceControlInput).toHaveText('')

  if (process.send) {
    process.send('succeeded')
  }
}

main()
