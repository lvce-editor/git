import { expect, test } from '@jest/globals'
import { getGitClientPath } from '../src/parts/GetGitClientPath/GetGitClientPath.ts'

test('gets the packaged git client path', () => {
  expect(getGitClientPath('file:///opt/lvce/extensions/builtin.git/dist/gitMain.js')).toBe('/opt/lvce/extensions/builtin.git/node/src/gitClient.js')
})

test('gets a remote git client path', () => {
  expect(getGitClientPath('https://example.com/remote/home/test/extensions/builtin.git/dist/gitMain.js')).toBe(
    '/home/test/extensions/builtin.git/node/src/gitClient.js',
  )
})
