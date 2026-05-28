/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitPull from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitPull.js'

test('id', () => {
  expect(ExtensionHostCommandGitPull.id).toEqual(expect.any(String))
})
