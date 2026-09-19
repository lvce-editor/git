import { expect, jest, test } from '@jest/globals'

const runCommit = jest.fn()
jest.unstable_mockModule('../src/parts/RunCommit/RunCommit.ts', () => ({
  runCommit,
}))

const Commit = await import('../src/parts/Commit/Commit.ts')

test('queues a commit requested while another commit is finishing', async () => {
  const firstCommitFinished = Promise.withResolvers<void>()
  runCommit.mockImplementationOnce(async () => firstCommitFinished.promise)

  const first = Commit.commit('first')
  const second = Commit.commit('second')
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(runCommit).toHaveBeenCalledTimes(1)
  firstCommitFinished.resolve()
  await Promise.all([first, second])

  expect(runCommit).toHaveBeenCalledTimes(2)
  expect(runCommit.mock.calls.map(([message]) => message)).toEqual(['first', 'second'])
})
