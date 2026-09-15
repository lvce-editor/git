import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const profile = await mkdtemp(join(tmpdir(), 'git-remote-shortcut-launcher-'))
const env = { ...process.env }
for (const kind of ['CONFIG', 'DATA', 'STATE', 'CACHE']) {
  env[`XDG_${kind}_HOME`] = join(profile, kind.toLowerCase())
}
const grouped = process.platform !== 'win32'
const child = spawn(
  process.execPath,
  [
    fileURLToPath(import.meta.resolve('@lvce-editor/test-with-playwright/bin/test-with-playwright.js')),
    '--test-path=electron',
    '--only-extension=.',
    '--runtime=electron',
    '--electron-version=v0.115.10',
    '--timeout=60000',
  ],
  { env, stdio: 'inherit', detached: grouped },
)
const kill = () => {
  try {
    if (grouped && child.pid) process.kill(-child.pid, 'SIGKILL')
    else child.kill('SIGKILL')
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
}
const deadline = setTimeout(kill, 120_000)
try {
  process.exitCode = await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code) => resolve(code ?? 1))
  })
} finally {
  clearTimeout(deadline)
  kill()
  await rm(profile, { recursive: true, force: true })
}
