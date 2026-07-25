import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import test from 'node:test'
import { buildNodeClient } from '../src/buildNodeClient.ts'

test('builds a self-contained node client', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'builtin-git-node-client-'))
  try {
    const outFile = join(temporaryDirectory, 'gitClient.js')
    await buildNodeClient(outFile)

    const gitClient = await import(pathToFileURL(outFile).toString())

    assert.deepEqual(Object.keys(gitClient), ['commandMap'])
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})
