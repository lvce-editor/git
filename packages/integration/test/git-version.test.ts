import { testWorker } from '../src/testWorker.js'

test('git version', async () => {
  const execMap = {}
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  expect(await worker.execute('Git.version', { cwd: '', gitPath: '' })).toBe('2.39.2')
})

test('git version - fatal unterminated line', async () => {
  const execMap = {
    '--version': {
      exitCode: 1,
      stderr: 'fatal: unterminated line in .git/packed-refs: 17171717171717171717171717171717171717',
      stdout: '',
    },
  }
  const config = {}
  const worker = await testWorker({
    config,
    execMap,
  })
  await expect(worker.execute('Git.version', { cwd: '', gitPath: '' })).rejects.toThrow(
    new Error(`Git: fatal: unterminated line in .git/packed-refs: 17171717171717171717171717171717171717`),
  )
})
