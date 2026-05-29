/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitCherryPick from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCherryPick.js'

test('id', () => {
  expect(ExtensionHostCommandGitCherryPick.id).toEqual(expect.any(String))
})
