import { expect, test } from '@jest/globals'
import { toFileUri } from '../src/parts/ToFileUri/ToFileUri.ts'

test.each([
  ['/work/nested/discard #100%.txt', 'file:///work/nested/discard%20%23100%25.txt'],
  ['/work/question?.txt', 'file:///work/question%3F.txt'],
  ['/work/back\\name.txt', 'file:///work/back%5Cname.txt'],
  ['C:\\work\\discard #100%.txt', 'file:///C:/work/discard%20%23100%25.txt'],
  ['C:/work/discard.txt', 'file:///C:/work/discard.txt'],
  ['\\\\server\\share\\discard.txt', 'file://server/share/discard.txt'],
])('converts native path %s to a filesystem URI', (path, uri) => {
  expect(toFileUri(path)).toBe(uri)
})
