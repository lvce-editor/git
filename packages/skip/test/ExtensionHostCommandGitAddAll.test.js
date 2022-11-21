import * as ExtensionHostCommandGitAddAll from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitAddAll.js'

beforeAll(() => {
  globalThis.vscode = {}
})

test('id', () => {
  expect(ExtensionHostCommandGitAddAll.id).toEqual(expect.any(String))
})
