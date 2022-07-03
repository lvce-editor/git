import {
  expect,
  runWithExtension,
  test,
} from '@lvce-editor/test-with-playwright'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'

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

test('git.pull-error-cannot-fast-forward-multiple-branches', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.txt'), 'div')
  const gitPath = await createFakeGitBinary(`
console.error("fatal: Cannot fast-forward to multiple branches.")
process.exit(128)
`)
  const configDir = await writeSettings({
    'git.path': gitPath,
  })
  const page = await runWithExtension({
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
    // TODO remove error prefix from error
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: fatal: Cannot fast-forward to multiple branches.'
    )
  }
})
