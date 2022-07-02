import * as ExtensionHostCommandGitCheckout from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCheckout.js'

test('id', () => {
  expect(ExtensionHostCommandGitCheckout.id).toEqual(expect.any(String))
})
