import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _electron } from '@playwright/test'

export const name = 'git-open-remote'

export const test = async ({ electronApp, expect }) => {
  const executablePath = await electronApp.evaluate(({ app }) => app.getPath('exe'))
  await electronApp.close()
  const profile = await mkdtemp(join(tmpdir(), 'lvce-open-remote-'))
  await writeFile(join(profile, 'zz-remote-fixture.txt'), 'Editor fixture')
  const { execFileSync } = await import('node:child_process')
  execFileSync('git', ['init', profile])
  execFileSync('git', ['-C', profile, 'remote', 'add', 'origin', 'git@github.com:owner/repo.git'])
  const server = createServer((_request, response) => {
    response.setHeader('Content-Type', 'text/html')
    response.end('<!doctype html><title>Local article</title><h1>Local article</h1><script>window.documentToken=crypto.randomUUID()</script>')
  })
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
  const url = `http://127.0.0.1:${server.address().port}/owner/repo`
  await mkdir(join(profile, 'config/lvce'), { recursive: true })
  await writeFile(
    join(profile, 'config/lvce/settings.json'),
    JSON.stringify({
      'git.remoteHosts': { 'github.com': `http://127.0.0.1:${server.address().port}` },
    }),
  )
  let app
  try {
    const env = { ...process.env, ONLY_EXTENSION: new URL('../../../../dist/', import.meta.url).pathname }
    delete env.ELECTRON_RUN_AS_NODE
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${key}_HOME`] = join(profile, key.toLowerCase())
    app = await _electron.launch({
      executablePath,
      args: ['--no-sandbox', `--user-data-dir=${join(profile, 'chromium')}`, profile],
      env,
      timeout: 60000,
    })
    const childEnv = await app.evaluate(() =>
      Object.fromEntries(['CONFIG', 'DATA', 'STATE', 'CACHE'].map((key) => [key, process.env[`XDG_${key}_HOME`]])),
    )
    for (const key of ['CONFIG', 'DATA', 'STATE', 'CACHE']) assert.equal(childEnv[key], join(profile, key.toLowerCase()))
    const page = await app.firstWindow()
    page.setDefaultTimeout(15000)
    page.on('pageerror', (error) => console.error(error))
    page.on('console', (message) => {
      if (message.type() === 'error') console.error(message.text())
    })
    await expect(page.locator('#Workbench')).toBeVisible()
    const explorer = page.getByRole('tree', { name: 'Files Explorer' })
    await expect(explorer).toBeVisible()
    await page.getByRole('treeitem', { name: 'cache', exact: true }).click()
    await expect(page.getByRole('treeitem', { name: 'cache', exact: true })).toHaveAttribute('id', 'TreeItemActive')
    await expect(explorer).toBeFocused()
    // A handled Explorer shortcut confirms its asynchronous keybinding context is active.
    await explorer.press('End')
    await expect(page.getByRole('treeitem', { name: 'zz-remote-fixture.txt', exact: true })).toHaveAttribute('id', 'TreeItemActive')
    await page.keyboard.press('.')
    const address = page.locator('[name="simple-browser-address"]')
    await expect(address).toHaveValue(url)
    const token = () =>
      app.evaluate(async ({ webContents }, url) => {
        const target = webContents.getAllWebContents().find((item) => item.getURL() === url)
        return target?.executeJavaScript('document.querySelector("h1")?.textContent === "Local article" && window.documentToken')
      }, url)
    await expect.poll(token).toBeTruthy()
    const originalToken = await token()
    const count = await page.locator('.SimpleBrowser').getByRole('tab').count()
    const command = async (label) => {
      await page.keyboard.press('Control+Shift+P')
      const input = page.locator('.QuickPick input')
      await input.fill('>' + label)
      await page.getByRole('option', { name: label, exact: true }).click()
      await expect(input).not.toBeVisible()
    }
    await command('Git: Open Remote in Simple Browser')
    await expect(address).toHaveValue(url)
    await expect(page.locator('.SimpleBrowser').getByRole('tab')).toHaveCount(count)
    assert.equal(await token(), originalToken)
    // Typing a period in the address field must not invoke the workspace shortcut.
    await address.click()
    await expect(address).toBeFocused()
    await address.press('Control+A')
    await address.press('.')
    await expect(address).toHaveValue('.')
    await address.press('Escape')
    await command('Layout: Hide Preview')
    await expect(page.locator('.SimpleBrowser')).not.toBeVisible()
    await page.getByRole('treeitem', { name: 'cache', exact: true }).click()
    await expect(page.getByRole('treeitem', { name: 'cache', exact: true })).toHaveAttribute('id', 'TreeItemActive')
    await expect(explorer).toBeFocused()
    // A handled Explorer shortcut confirms its asynchronous keybinding context is active.
    await explorer.press('End')
    await expect(page.getByRole('treeitem', { name: 'zz-remote-fixture.txt', exact: true })).toHaveAttribute('id', 'TreeItemActive')
    await page.keyboard.press('.')
    await expect(address).toHaveValue(url)
    await expect.poll(token).toBeTruthy()
    console.log('Git remote shortcut opens the mapped local page, reuses its tab, preserves text input, and restores hidden preview')
  } finally {
    await app?.close()
    await new Promise((resolveClose) => server.close(resolveClose))
    await rm(profile, { recursive: true, force: true })
  }
}
