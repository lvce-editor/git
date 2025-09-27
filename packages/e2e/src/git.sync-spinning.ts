import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.sync-spinning'

export const skip = true

export const test: Test = async ({ FileSystem, Workspace, Settings, Locator, expect }) => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await createFakeGitBinary(`
const main = async () => {
  const argv = process.argv.slice(2)
  switch(argv[0]){
    case 'pull':
      await new Promise((resolve) => setTimeout(resolve, 500))
      process.exit(0)
      break
    case 'push':
      await new Promise((resolve) => setTimeout(resolve, 500))
      process.exit(0)
      break
    default:
      console.error(\`unexpected git command \${argv[0]}\`)
      process.exit(1)
  }
}

main()
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
  await quickPickInput.type('git sync')
  const quickPickItemGitSync = quickPick.locator('text=Git: Sync')
  await quickPickItemGitSync.click()
  const statusBarItemSync = page.locator('.StatusBarItem[data-name="sync head"]')
  const statusBarItemSyncIcon = statusBarItemSync.locator('.StatusBarIcon')
  await expect(statusBarItemSyncIcon).toBeVisible()
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon AnimationSpin')

  // wait for some time, not sure how long, then spin animation should be over
  await expect(statusBarItemSyncIcon).toHaveClass('StatusBarIcon', {
    timeout: 10_000,
  })

  // await expect(statusBarItemSyncIcon).toBeVisible()
  // await expect(statusBarItemSyncIcon).toHaveClass('Icon')

  console.log('finished')

  if (process.send) {
    process.send('succeeded')
  }
}
