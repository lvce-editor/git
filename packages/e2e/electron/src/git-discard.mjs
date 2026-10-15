import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { _electron } from '@playwright/test'

export const name = 'git-discard'

export const test = async ({ electronApp, expect }) => {
  const executablePath = await electronApp.evaluate(({ app }) => app.getPath('exe'))
  electronApp.process().kill('SIGKILL')
  await electronApp.close()
  const fixtureRoot = fileURLToPath(new URL('../../../../.tmp/', import.meta.url))
  await mkdir(fixtureRoot, { recursive: true })
  const profile = await mkdtemp(join(fixtureRoot, 'lvce-git-discard-'))
  const workspaceDir = join(profile, 'workspace')
  for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) await mkdir(join(profile, key.toLowerCase()))
  let app
  let page
  try {
    execFileSync('git', ['init', '--initial-branch=main', workspaceDir])
    execFileSync('git', ['-C', workspaceDir, 'config', 'user.name', 'LVCE E2E'])
    execFileSync('git', ['-C', workspaceDir, 'config', 'user.email', 'lvce-e2e@example.test'])
    await writeFile(join(workspaceDir, 'tracked.txt'), 'original')
    execFileSync('git', ['-C', workspaceDir, 'add', 'tracked.txt'])
    execFileSync('git', ['-C', workspaceDir, 'commit', '-m', 'initial'])
    await writeFile(join(workspaceDir, 'tracked.txt'), 'modified')
    await writeFile(join(workspaceDir, 'discard #100%.txt'), 'discard')
    await writeFile(join(workspaceDir, 'preserve.txt'), 'preserve')
    await mkdir(join(profile, 'config', 'lvce'))
    await writeFile(join(profile, 'config', 'lvce', 'settings.json'), JSON.stringify({ 'git.confirmDiscard': false, 'git.showErrorMessage': false }))

    const env = { ...process.env, ONLY_EXTENSION: fileURLToPath(new URL('../../../../dist/', import.meta.url)) }
    delete env.ELECTRON_RUN_AS_NODE
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
    app = await _electron.launch({
      executablePath,
      args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, workspaceDir],
      env,
      timeout: 60000,
    })
    const childEnv = await app.evaluate(() => {
      return Object.fromEntries(['CONFIG', 'DATA', 'STATE', 'CACHE'].map((key) => [key, process.env[`XDG_${key}_HOME`]]))
    })
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) assert.equal(childEnv[key], join(profile, key.toLowerCase()))

    page = await app.firstWindow()
    await expect(page.locator('.StatusBarItem[name="git.showBranchPicker"]')).toHaveText('main')
    await expect(page.locator('.Explorer .TreeItem')).toHaveCount(3)
    await page.keyboard.press('Control+Shift+g')
    const items = page.locator('.SourceControlItems .TreeItem')
    const discardedItem = items.filter({ hasText: 'discard #100%.txt' })
    await discardedItem.hover()
    await discardedItem.getByRole('button', { name: 'Discard', exact: true }).click()
    await expect
      .poll(() =>
        access(join(workspaceDir, 'discard #100%.txt')).then(
          () => true,
          () => false,
        ),
      )
      .toBe(false)
    await expect(discardedItem).toHaveCount(0)
    assert.equal(await readFile(join(workspaceDir, 'preserve.txt'), 'utf8'), 'preserve')
    assert.equal(await readFile(join(workspaceDir, 'tracked.txt'), 'utf8'), 'modified')

    const trackedItem = items.filter({ hasText: 'tracked.txt' })
    await trackedItem.hover()
    await trackedItem.getByRole('button', { name: 'Discard', exact: true }).click()
    await expect.poll(() => readFile(join(workspaceDir, 'tracked.txt'), 'utf8')).toBe('original')
    await expect(trackedItem).toHaveCount(0)
    assert.equal(await readFile(join(workspaceDir, 'preserve.txt'), 'utf8'), 'preserve')
  } catch (error) {
    await mkdir('../../.tmp/discard-electron', { recursive: true })
    await page?.screenshot({ path: '../../.tmp/discard-electron/failure.png' })
    await writeFile('../../.tmp/discard-electron/failure.html', (await page?.content()) || '')
    throw error
  } finally {
    await app?.close()
    await rm(profile, { recursive: true, force: true })
  }
}
