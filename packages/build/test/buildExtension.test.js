import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { bundleJs } from '@lvce-editor/package-extension'
import { root } from '../src/root.ts'

test('uses the scoped node rpc command', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'builtin-git-extension-'))
  try {
    const outFile = join(temporaryDirectory, 'gitMain.js')
    await bundleJs(join(root, 'packages', 'extension', 'src', 'gitMain.ts'), outFile, false)

    const bundle = await readFile(outFile, 'utf8')

    assert.match(bundle, /Extensions\.createNodeRpcConnection/)
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})
