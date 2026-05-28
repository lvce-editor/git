/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitCreateWorktree from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCreateWorktree.js'

test('id', () => {
  expect(ExtensionHostCommandGitCreateWorktree.id).toEqual(expect.any(String))
})
