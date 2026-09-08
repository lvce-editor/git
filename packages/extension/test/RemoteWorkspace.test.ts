import { expect, test } from '@jest/globals'
import { getInvoke } from '../src/parts/GetInvoke/GetInvoke.ts'
import { getRelativePath } from '../src/parts/GetRelativePath/GetRelativePath.ts'
import * as Rpc from '../src/parts/Rpc/Rpc.ts'

test('remote workspaces select the native Node RPC', () => {
  expect(getInvoke('remote-ssh://host/work')).toBe(Rpc.invoke)
  expect(getInvoke('file:///work')).toBe(Rpc.invoke)
  expect(getInvoke('memfs:///work')).not.toBe(Rpc.invoke)
})

test('relative file paths stay within the same SSH authority', () => {
  expect(getRelativePath('remote-ssh://host/work', 'remote-ssh://host/work/test%20file')).toBe('test file')
  expect(getRelativePath('remote-ssh://host/work', 'remote-ssh://other/work/test')).toBeUndefined()
  expect(getRelativePath('remote-ssh://user@host/work', 'remote-ssh://other@host/work/test')).toBeUndefined()
  expect(getRelativePath('remote-ssh://host/work', 'file:///work/test')).toBeUndefined()
})
