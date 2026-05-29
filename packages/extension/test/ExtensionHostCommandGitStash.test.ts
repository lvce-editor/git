/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitStash from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitStash.js'

test('id', () => {
  expect(ExtensionHostCommandGitStash.id).toEqual(expect.any(String))
})
