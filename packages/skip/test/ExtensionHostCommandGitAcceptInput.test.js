import * as ExtensionHostCommandGitAcceptInput from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'

test('id', () => {
  expect(ExtensionHostCommandGitAcceptInput.id).toEqual(expect.any(String))
})
