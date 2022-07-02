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

console.error("oops")
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
  const viewletSourceControl = page.locator('[title="Source Control"]')
  await viewletSourceControl.click()
  const error = await page.waitForSelector('.Error')
  const errorText = await error.textContent()
  // TODO should improve error message and buttons
  // 1. try again button
  // 2. open git log button
  if (
    errorText !==
    'Error: GitError: Git.getModifiedFiles failed to execute: oops'
  ) {
    console.log({ errorText })
    return
  }
  // await page.waitForSelector('text=')
  // await page.waitForSelector('.TreeItem:has-text("GitRequests.js")')
  // await page.waitForSelector('.TreeItem:has-text("InternalCommand.js")')
  if (process.send) {
    process.send('succeeded')
  }
}

main()
