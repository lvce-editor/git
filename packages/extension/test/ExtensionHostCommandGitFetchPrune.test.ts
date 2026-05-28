/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitFetchPrune from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitFetchPrune.js'

test('id', () => {
  expect(ExtensionHostCommandGitFetchPrune.id).toEqual(expect.any(String))
})
