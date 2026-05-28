/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitMerge from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitMerge.js'

test('id', () => {
  expect(ExtensionHostCommandGitMerge.id).toEqual(expect.any(String))
})
