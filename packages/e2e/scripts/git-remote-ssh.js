import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

export const test = async ({ page, expect, sshServer, port, socketUrls, sockets }) => {
  const requests = []
  for (const socket of sockets) {
    const url = new URL(socket.url())
    if (url.searchParams.get('extensionId') === 'builtin.git') {
      socket.on('framesent', ({ payload }) => {
        const message = JSON.parse(String(payload))
        if (message.method === 'Exec.exec') requests.push(message)
      })
    }
  }
  const workspace = sshServer.fixture.workspacePath
  const specialName = 'remote space #%.txt'
  await writeFile(join(workspace, specialName), 'remote-only change\n')

  const command = async (label) => {
    await page.keyboard.press('F1')
    const input = page.locator('.QuickPick input')
    await expect(input).toBeVisible()
    await input.fill(`>${label}`)
    await page.locator('.QuickPickItemLabel').filter({ hasText: label }).first().click()
    await expect(input).toHaveCount(0)
  }

  await command('Git: Stage All')
  await expect(async () => {
    const { stdout } = await run('git', ['-C', workspace, 'diff', '--cached', '--name-only', '-z'])
    expect(stdout.split('\0')).toEqual(expect.arrayContaining(['file.txt', specialName]))
  }).toPass({ timeout: 30_000 })

  await command('Git: Unstage All')
  await expect(async () => {
    const { stdout } = await run('git', ['-C', workspace, 'diff', '--cached', '--name-only'])
    expect(stdout).toBe('')
  }).toPass({ timeout: 30_000 })
  expect(await readFile(sshServer.filePath, 'utf8')).toBe(sshServer.fixture.updatedContent)

  const gitSockets = socketUrls.filter(
    (url) => url.pathname === '/websocket/extension-node-process' && url.searchParams.get('extensionId') === 'builtin.git',
  )
  expect(gitSockets.length).toBeGreaterThan(0)
  expect(gitSockets.every((url) => url.port !== String(port))).toBe(true)
  expect(requests.some(({ params }) => params[1][0] === 'add')).toBe(true)
  for (const { params } of requests) {
    expect(params[2].cwd).toBe(`file://${workspace}`)
  }
  console.log('PASS Git over SSH: branch, changed file, stage, unstage, encoded filename, remote process routing')
}
