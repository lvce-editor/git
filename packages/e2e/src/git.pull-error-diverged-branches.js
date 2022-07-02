import { expect } from '@playwright/test'
import { chmod, mkdtemp, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'os'
import {
  runWithExtension,
  useElectron,
  writeSettings,
} from './runWithExtension.js'

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
console.error(\`> git pull --tags origin main
From https://github.com/user/repo
 * branch              main       -> FETCH_HEAD
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
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
  await quickPickItemGitPull.click()

  // TODO should show option to rebase (git pull --rebase)
  if (useElectron) {
    // TODO
  } else {
    const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
    await expect(dialogErrorMessage).toBeVisible()
    // TODO error message could be improved, should include full git error message
    await expect(dialogErrorMessage).toHaveText(
      'Error: Git: hint: You have divergent branches and need to specify how to reconcile them.'
    )
  }
  if (process.send) {
    process.send('succeeded')
  }
}

main()
