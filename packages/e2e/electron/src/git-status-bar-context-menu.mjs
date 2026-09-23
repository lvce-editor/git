import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _electron } from '@playwright/test'

export const name = 'git-status-bar-context-menu'

export const test = async ({ electronApp, expect }) => {
  const executablePath = await electronApp.evaluate(({ app }) => app.getPath('exe'))
  await electronApp.close()
  const profile = await mkdtemp(join(tmpdir(), 'lvce-git-status-bar-menu-'))
  const workspaceDir = join(profile, 'workspace')
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) await mkdir(join(profile, key.toLowerCase()))
  let app
  try {
    execFileSync('git', ['init', '--initial-branch=main', workspaceDir])
    execFileSync('git', ['-C', workspaceDir, 'config', 'user.name', 'LVCE E2E'])
    execFileSync('git', ['-C', workspaceDir, 'config', 'user.email', 'lvce-e2e@example.test'])
    await writeFile(join(workspaceDir, 'readme.txt'), 'main branch')
    execFileSync('git', ['-C', workspaceDir, 'add', 'readme.txt'])
    execFileSync('git', ['-C', workspaceDir, 'commit', '-m', 'main branch'])
    execFileSync('git', ['-C', workspaceDir, 'switch', '-c', 'feature'])

    const env = { ...process.env, ONLY_EXTENSION: new URL('../../../../dist/', import.meta.url).pathname }
    delete env.ELECTRON_RUN_AS_NODE
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
    app = await _electron.launch({
      executablePath,
      args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, workspaceDir],
      env,
      timeout: 60000,
    })
    const childEnv = await app.evaluate(() => {
      const keys = ['CONFIG', 'DATA', 'STATE', 'CACHE']
      return Object.fromEntries(keys.map((key) => [key, process.env[`XDG_${key}_HOME`]]))
    })
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) {
      assert.equal(childEnv[key], join(profile, key.toLowerCase()))
    }

    const page = await app.firstWindow()
    const branchStatusBarItem = page.locator('.StatusBarItem[data-name="git.showBranchPicker"], .StatusBarItem[name="git.showBranchPicker"]')
    await expect(branchStatusBarItem).toHaveText('feature')
    await branchStatusBarItem.click({ button: 'right' })
    await expect(page.locator('.MenuItem', { hasText: 'Switch to main branch' })).toBeVisible()
    await expect(page.locator('.MenuItem', { hasText: 'Hide Status Bar' })).toBeVisible()
    await page.locator('.MenuItem', { hasText: 'Switch to main branch' }).click()
    await expect(branchStatusBarItem).toHaveText('main')
  } finally {
    await app?.close()
    await rm(profile, { recursive: true, force: true })
  }
}
