/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitCreateBranch from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCreateBranch.js'

test('id', () => {
  expect(ExtensionHostCommandGitCreateBranch.id).toEqual(expect.any(String))
})
