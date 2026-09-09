import { expect, test } from '@jest/globals'
import { getWorkspaceUris, toGitPath, toRelativePath, toRemoteUri, toWorkspaceUri } from '../src/parts/WorkspaceUris/WorkspaceUris.ts'

test.each(['file:///home/me/project', '/home/me/project', 'file:///C:/project', 'memfs://project'])(
  'local workspace URIs remain identical: %s',
  (workspaceUri) => {
    expect(getWorkspaceUris(workspaceUri)).toEqual({ remoteWorkspaceUri: workspaceUri, workspaceUri })
  },
)

test('remote URI conversion preserves encoding until the native path is needed', () => {
  const uri = 'remote-ssh://user@[::1]:2222/home/a%20%23%25'
  expect(toRemoteUri(uri)).toBe('file:///home/a%20%23%25')
  expect(toGitPath(uri, uri)).toBe('/home/a #%')
  expect(toWorkspaceUri('/home/a #%/b.txt', uri)).toBe(`${uri}/b.txt`)
  expect(toRelativePath(`${uri}/b.txt`, uri)).toBe('b.txt')
})

test.each(['remote-ssh://other/work/a', 'remote-ssh://user@host:2223/work/a', 'remote-ssh://other@host:2222/work/a'])(
  'rejects mismatched authority: %s',
  (uri) => {
    expect(() => toRemoteUri(uri, 'remote-ssh://user@host:2222/work')).toThrow('different remote workspace host')
  },
)

test.each(['remote-ssh://host/work?query', 'remote-ssh://host/work#fragment', 'remote-ssh://host/work%00', 'remote-ssh://user:password@host/work'])(
  'rejects invalid remote URI: %s',
  (uri) => {
    expect(() => toRemoteUri(uri)).toThrow()
  },
)

test('repository containment compares complete path segments and preserves remote backslashes', () => {
  expect(() => toRelativePath('remote-ssh://host/work-other/a', 'remote-ssh://host/work')).toThrow('outside the repository')
  expect(toRelativePath('remote-ssh://host/work/a%5Cb', 'remote-ssh://host/work')).toBe('a\\b')
})
