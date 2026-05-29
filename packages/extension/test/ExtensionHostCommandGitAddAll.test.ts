/**
 * @jest-environment lvce-editor
 */
import { expect, test } from '@jest/globals'
import * as ExtensionHostCommandGitAddAll from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitAddAll.js'

test('id', () => {
  expect(ExtensionHostCommandGitAddAll.id).toEqual(expect.any(String))
})
