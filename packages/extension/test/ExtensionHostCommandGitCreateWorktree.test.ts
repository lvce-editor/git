/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitCreateWorktree from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCreateWorktree.js'

test('id', () => {
  expect(ExtensionHostCommandGitCreateWorktree.id).toEqual(expect.any(String))
})
