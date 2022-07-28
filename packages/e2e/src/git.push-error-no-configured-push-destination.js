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

test('git.push-error-no-configured-push-destination', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error(\`fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

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
  await quickPickInput.type('git push')
  const quickPickItemGitPush = quickPick.locator('text=Git: Push').first()
  await quickPickItemGitPush.click()

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
    await quickPickItemGitPush.click()
    // TODO error message could be improved
    // const { args } = await evaluatePromise
    // expect(args[1].message).toBe(
    //   `Error: OperationalError: Git.pull failed to execute: ssh: Could not resolve hostname github.com: Temporary failure in name resolution`
    // )
  } else {
    await quickPickItemGitPush.click()
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO remove error prefix from error
    // TODO improve error message

    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: fatal: No configured push destination.'
    )
  }
})
