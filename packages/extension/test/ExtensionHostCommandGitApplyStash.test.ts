/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitApplyStash from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitApplyStash.js'

test('id', () => {
  expect(ExtensionHostCommandGitApplyStash.id).toEqual(expect.any(String))
})
