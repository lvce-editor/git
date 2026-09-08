import { expect, test } from '@jest/globals'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { exec } from '../../node/src/parts/Exec/Exec.js'
import { getInvoke } from '../src/parts/GetInvoke/GetInvoke.ts'
import { getRelativePath } from '../src/parts/GetRelativePath/GetRelativePath.ts'
import * as Rpc from '../src/parts/Rpc/Rpc.ts'

test('remote workspaces select the native Node RPC', () => {
  expect(getInvoke('remote-ssh://host/work')).toBe(Rpc.invoke)
  expect(getInvoke('file:///work')).toBe(Rpc.invoke)
  expect(getInvoke('memfs:///work')).not.toBe(Rpc.invoke)
})

test('remote Git runs in the decoded workspace directory', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'git remote workspace '))
  try {
    const uri = new URL('remote-ssh://user@host:2222/')
    uri.pathname = cwd
    await exec('git', ['init', '--quiet'], { cwd: uri.href })
    const result = await exec('git', ['rev-parse', '--show-toplevel'], { cwd: uri.href })
    expect(result.stdout).toBe(cwd)
  } finally {
    await rm(cwd, { recursive: true, force: true })
  }
})

test('relative file paths stay within the same SSH authority', () => {
  expect(getRelativePath('remote-ssh://host/work', 'remote-ssh://host/work/test%20file')).toBe('test file')
  expect(getRelativePath('remote-ssh://host/work', 'remote-ssh://other/work/test')).toBeUndefined()
  expect(getRelativePath('remote-ssh://user@host/work', 'remote-ssh://other@host/work/test')).toBeUndefined()
  expect(getRelativePath('remote-ssh://host/work', 'file:///work/test')).toBeUndefined()
})
