/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitFetch from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitFetch.js'

test('id', () => {
  expect(ExtensionHostCommandGitFetch.id).toEqual(expect.any(String))
})
