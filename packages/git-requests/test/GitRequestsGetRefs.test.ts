import * as GitRefType from '../src/parts/GitRefType/GitRefType.js'
import * as GitRequestsGetRefs from '../src/parts/GitRequestsGetRefs/GitRequestsGetRefs.js'

// cspell:ignore authorname committerdate
test('getRefs', async (): Promise<void> => {
  const calls: string[][] = []
  const exec = async (options: Readonly<{ args: readonly string[] }>): Promise<{ stderr: string; stdout: string }> => {
    calls.push([...options.args])
    return {
      stderr: '',
      stdout: [
        [
          'refs/remotes/origin/HEAD',
          '903f9903f4f14e0d7ec1a389b9da617848e7f609',
          '',
          'origin/main',
          '2 minutes ago',
          'Test User',
          'Initial commit',
          '',
          '',
          '',
        ].join('\0'),
        [
          'refs/remotes/origin/main',
          '903f9903f4f14e0d7ec1a389b9da617848e7f609',
          '',
          '',
          '2 minutes ago',
          'Test User',
          'Initial commit',
          '',
          '',
          '',
        ].join('\0'),
        [
          'refs/remotes/origin/sandy081/powerful-flea',
          '903f9903f4f14e0d7ec1a389b9da617848e7f609',
          '',
          '',
          '1 day ago',
          'Sandy',
          'Powerful flea',
          '',
          '',
          '',
        ].join('\0'),
        [
          'refs/remotes/origin/lszomoru/product-build-parallel',
          '7ed03031bb8511eada0f8418550e33a70e208106',
          '',
          '',
          '2 days ago',
          'Remote User',
          'Build in parallel',
          '',
          '',
          '',
        ].join('\0'),
      ].join('\n'),
    }
  }
  const result = await GitRequestsGetRefs.getRefs({
    cwd: '/test/test-folder',
    exec,
    gitPath: '',
  })
  expect(result).toEqual([
    {
      authorName: 'Test User',
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      commitDate: '2 minutes ago',
      name: 'origin/HEAD',
      remote: 'origin',
      subject: 'Initial commit',
      symbolicRef: 'origin/main',
      type: GitRefType.RemoteHead,
    },
    {
      authorName: 'Test User',
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      commitDate: '2 minutes ago',
      name: 'origin/main',
      remote: 'origin',
      subject: 'Initial commit',
      type: GitRefType.RemoteHead,
    },
    {
      authorName: 'Sandy',
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      commitDate: '1 day ago',
      name: 'origin/sandy081/powerful-flea',
      remote: 'origin',
      subject: 'Powerful flea',
      type: GitRefType.RemoteHead,
    },
    {
      authorName: 'Remote User',
      commit: '7ed03031bb8511eada0f8418550e33a70e208106',
      commitDate: '2 days ago',
      name: 'origin/lszomoru/product-build-parallel',
      remote: 'origin',
      subject: 'Build in parallel',
      type: GitRefType.RemoteHead,
    },
  ])
  expect(calls).toEqual([
    [
      'for-each-ref',
      '--format',
      [
        '%(refname)',
        '%(objectname)',
        '%(*objectname)',
        '%(symref:short)',
        '%(committerdate:relative)',
        '%(authorname)',
        '%(subject)',
        '%(*committerdate:relative)',
        '%(*authorname)',
        '%(*subject)',
      ].join('%00'),
    ],
  ])
})

test('getRefs uses peeled commit metadata for annotated tags', async (): Promise<void> => {
  const exec = async (): Promise<{ stderr: string; stdout: string }> => ({
    stderr: '',
    stdout: [
      'refs/tags/v1.0.0',
      '1111111111111111111111111111111111111111',
      '2222222222222222222222222222222222222222',
      '',
      '',
      '',
      'v1.0.0',
      '3 days ago',
      'Release Bot',
      'Release 1.0.0',
    ].join('\0'),
  })

  await expect(
    GitRequestsGetRefs.getRefs({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).resolves.toEqual([
    {
      authorName: 'Release Bot',
      commit: '2222222222222222222222222222222222222222',
      commitDate: '3 days ago',
      name: 'v1.0.0',
      remote: '',
      subject: 'Release 1.0.0',
      type: GitRefType.Tag,
    },
  ])
})

test('getRefs - error', async (): Promise<void> => {
  const exec = async (): Promise<never> => {
    throw new TypeError(`x is not a function`)
  }
  await expect(
    GitRequestsGetRefs.getRefs({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: x is not a function'))
})
