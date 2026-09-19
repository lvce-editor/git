import { expect, test } from '@jest/globals'
import * as CommitQueue from '../src/parts/CommitQueue/CommitQueue.ts'

test('queues a commit requested while another commit is finishing', async () => {
  const firstCommitFinished = Promise.withResolvers<void>()
  const queue = CommitQueue.create()
  const started: string[] = []

  const first = queue.run(async () => {
    started.push('first')
    await firstCommitFinished.promise
  })
  const second = queue.run(async () => {
    started.push('second')
  })
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(started).toEqual(['first'])
  firstCommitFinished.resolve()
  await Promise.all([first, second])

  expect(started).toEqual(['first', 'second'])
})

test('continues after a failed commit', async () => {
  const queue = CommitQueue.create()
  const started: string[] = []
  const first = queue.run(async () => {
    started.push('first')
    throw new Error('failed')
  })
  const second = queue.run(async () => {
    started.push('second')
  })

  await expect(first).rejects.toThrow('failed')
  await second
  expect(started).toEqual(['first', 'second'])
})
