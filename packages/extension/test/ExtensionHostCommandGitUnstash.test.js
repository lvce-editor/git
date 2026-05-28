/**
 * @jest-environment lvce-editor
 */
import * as ExtensionHostCommandGitUnstash from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitUnstash.js'

test('id', () => {
  expect(ExtensionHostCommandGitUnstash.id).toEqual(expect.any(String))
})
