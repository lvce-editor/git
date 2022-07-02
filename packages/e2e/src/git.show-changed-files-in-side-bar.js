import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'
import { runWithExtension, root, writeSettings } from './runWithExtension.js'

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
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await createFakeGitBinary(`

console.log(\` M extensions/builtin.git/src/parts/GitRequests/GitRequests.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js
\`)
process.exit(0)
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
  const activityBarItemSourceControl = page.locator('[title="Source Control"]')
  await activityBarItemSourceControl.click()
  await page.waitForSelector('.TreeItem:has-text("GitRequests.js")')
  await page.waitForSelector('.TreeItem:has-text("InternalCommand.js")')
  if (process.send) {
    process.send('succeeded')
  }
}

main()
