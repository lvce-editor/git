import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  useElectron,
  writeSettings,
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

test('git.push-error-offline', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await createFakeGitBinary(`setTimeout(()=>{}, 9999999)`)
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
  await quickPickInput.type('git push')
  const quickPickItemGitPush = quickPick.locator('text=Git: Push')
  await quickPickItemGitPush.click()

  if (useElectron) {
    // TODO
  } else {
    // TODO after a fixed amount of time, should show a message that command is running too long
    // with a cancel button

    // TODO background operations like git fetch in the background should not show timeout error when they fail
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, maybe something like Git operations was canceled after 3 seconds
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git push timeout out after 3000ms'
    )
  }
})
