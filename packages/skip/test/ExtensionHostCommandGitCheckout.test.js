/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitCheckout from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCheckout.js'

test('id', () => {
  console.log('test')
  expect(ExtensionHostCommandGitCheckout.id).toEqual(expect.any(String))
})
