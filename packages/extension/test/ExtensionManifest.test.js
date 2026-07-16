import { expect, test } from '@jest/globals'
import { readFileSync } from 'node:fs'

test('all commands have labels', () => {
  const manifestUrl = new URL('../extension.json', import.meta.url)
  const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'))
  const missingLabels = manifest.commands.filter((command) => !command.label).map((command) => command.id)

  expect(missingLabels).toEqual([])
})

test('declares the git client node rpc', () => {
  const manifestUrl = new URL('../extension.json', import.meta.url)
  const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'))

  expect(manifest.rpc).toContainEqual({
    id: 'git-client',
    name: 'Git',
    type: 'node',
    url: '../node/src/gitClient.js',
  })
})
