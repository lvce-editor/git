/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitFetchPrune from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitFetchPrune.js'

test('id', () => {
  expect(ExtensionHostCommandGitFetchPrune.id).toEqual(expect.any(String))
})
