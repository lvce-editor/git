import { strictEqual } from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { exec } from '../src/parts/Exec/Exec.js'

test('remote Git runs in the decoded workspace directory', { skip: process.platform === 'win32' }, async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'git remote workspace '))
  try {
    const uri = new URL('remote-ssh://user@host:2222/')
    uri.pathname = cwd
    await exec('git', ['init', '--quiet'], { cwd: uri.href })
    const result = await exec('git', ['rev-parse', '--show-toplevel'], { cwd: uri.href })
    strictEqual(result.stdout, cwd)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})
