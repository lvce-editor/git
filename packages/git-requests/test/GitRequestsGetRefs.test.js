import * as GitRequestsGetRefs from '../src/parts/GitRequestsGetRefs/GitRequestsGetRefs.js'

// TODO mock exec instead

test.skip('getRefs', async () => {
  // @ts-ignore
  const exec = () => {
    return {
      stdout: `refs/remotes/origin/HEAD 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/main 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/sandy081/powerful-flea 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/lszomoru/product-build-parallel 7ed03031bb8511eada0f8418550e33a70e208106\u0020`,
      stderr: '',
    }
  }
  expect(
    await GitRequestsGetRefs.getRefs({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).toEqual([
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/HEAD',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/main',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/sandy081/powerful-flea',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '7ed03031bb8511eada0f8418550e33a70e208106',
      name: 'origin/lszomoru/product-build-parallel',
      remote: 'origin',
      type: 'remoteHead',
    },
  ])
})

test('getRefs - error', async () => {
  const exec = () => {
    throw new TypeError(`x is not a function`)
  }
  await expect(
    GitRequestsGetRefs.getRefs({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: x is not a function'))
})
