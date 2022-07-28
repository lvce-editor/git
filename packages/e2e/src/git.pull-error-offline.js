import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
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

test('git.pull-error-offline', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error(\`ssh: Could not resolve hostname github.com: Temporary failure in name resolution
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

  if (useElectron) {
    // TODO playwright doesn't seem to support electron dialog windows
    // @ts-ignore
    // const evaluatePromise = page.electronApp.evaluate(async ({ dialog }) => {
    //   return new Promise((resolve) => {
    //     dialog.showMessageBox = async (...args) => {
    //       resolve({ args })
    //       return {
    //         canceled: false,
    //       }
    //     }
    //   })
    // })
    await quickPickItemGitPull.click()
    // TODO error message could be improved
    // const { args } = await evaluatePromise
    // expect(args[1].message).toBe(
    //   `Error: OperationalError: Git.pull failed to execute: ssh: Could not resolve hostname github.com: Temporary failure in name resolution`
    // )
  } else {
    await quickPickItemGitPull.click()
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, vscode has very good/short git error messages
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: ssh: Could not resolve hostname github.com: Temporary failure in name resolution'
    )
  }
})
