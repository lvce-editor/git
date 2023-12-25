import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Exec/Exec.js', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GitRequestsDiscard = await import('../src/parts/GitRequestsDiscard/GitRequestsDiscard.js')
const Exec = await import('../src/parts/Exec/Exec.js')

test.skip('discard', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    return {
      stdout: '',
      stderr: '',
      exitCode: 0,
    }
  })
  GitRequestsDiscard.discard({
    cwd: '/test/test-folder',
    gitPath: 'git',
    file: 'index.js',
  })
  expect(Exec.exec).toHaveBeenCalledTimes(1)
  expect(Exec.exec).toHaveBeenCalledWith('git', ['clean', '-f', '-q', 'index.js'], {
    cwd: '/test/test-folder',
    env: expect.anything(),
  })
})
