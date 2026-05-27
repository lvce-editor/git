import * as GitRequestsGetCommits from '../src/parts/GitRequestsGetCommits/GitRequestsGetCommits.js'

test('getCommits', async () => {
  // @ts-ignore
  const exec = () => {
    return {
      stderr: '',
      stdout: `903f9903f4f14e0d7ec1a389b9da617848e7f609\tFirst commit
7ed03031bb8511eada0f8418550e33a70e208106\tSecond commit`,
    }
  }
  expect(
    await GitRequestsGetCommits.getCommits({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).toEqual([
    {
      hash: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      message: 'First commit',
    },
    {
      hash: '7ed03031bb8511eada0f8418550e33a70e208106',
      message: 'Second commit',
    },
  ])
})

test('getCommits - error', async () => {
  const exec = () => {
    throw new TypeError(`x is not a function`)
  }
  await expect(
    GitRequestsGetCommits.getCommits({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: x is not a function'))
})
