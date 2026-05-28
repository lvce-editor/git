/**
 * @jest-environment lvce-editor
 */
import { jest } from '@jest/globals'
import * as ExtensionHostCommandGitPull from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitPull.js'
import * as GitWorker from '../src/parts/GitWorker/GitWorker.js'

test('id', () => {
  expect(ExtensionHostCommandGitPull.id).toEqual(expect.any(String))
})

test('execute', async () => {
  const invoke = jest.spyOn(GitWorker, 'invoke').mockResolvedValue(undefined)
  const options = {
    from: ['origin', 'main'],
  }
  await ExtensionHostCommandGitPull.execute(options)
  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('Command.gitPull', options)
})
