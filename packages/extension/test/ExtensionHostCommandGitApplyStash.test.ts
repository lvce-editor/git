/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitApplyStash from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitApplyStash.js'

test('id', () => {
  expect(ExtensionHostCommandGitApplyStash.id).toEqual(expect.any(String))
})
