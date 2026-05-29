/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitShowBranchPicker from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitShowBranchPicker.js'

test('id', () => {
  expect(ExtensionHostCommandGitShowBranchPicker.id).toEqual(expect.any(String))
})
