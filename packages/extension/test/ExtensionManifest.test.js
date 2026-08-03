import { expect, test } from '@jest/globals'
import { readFileSync } from 'node:fs'

test('all commands have labels', () => {
  const manifestUrl = new URL('../extension.json', import.meta.url)
  const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'))
  const missingLabels = manifest.commands.filter((command) => !command.label).map((command) => command.id)

  expect(missingLabels).toEqual([])
})

test('all command activation events reference declared commands', () => {
  const manifestUrl = new URL('../extension.json', import.meta.url)
  const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'))
  const commandIds = new Set(manifest.commands.map((command) => command.id))
  const undeclaredCommands = manifest.activation
    .filter((event) => event.startsWith('onCommand:'))
    .map((event) => event.slice('onCommand:'.length))
    .filter((commandId) => !commandIds.has(commandId))

  expect(undeclaredCommands).toEqual([])
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
