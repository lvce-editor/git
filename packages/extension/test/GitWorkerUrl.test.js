import { expect, test } from '@jest/globals'
import { readFileSync } from 'node:fs'

test('resolves the git worker from the development extension bundle', () => {
  const sourceUrl = new URL('../src/parts/GitWorkerUrl/GitWorkerUrl.ts', import.meta.url)
  const source = readFileSync(sourceUrl, 'utf8')

  expect(source).toContain("new URL('../../git-worker/dist/gitWorkerMain.js', import.meta.url)")
})

test('bundles the rewritten extension source for the packaged layout', () => {
  const sourceUrl = new URL('../../build/src/build.ts', import.meta.url)
  const source = readFileSync(sourceUrl, 'utf8')

  expect(source).toContain("bundleJs(join(root, 'dist', 'src', 'gitMain.ts')")
})
