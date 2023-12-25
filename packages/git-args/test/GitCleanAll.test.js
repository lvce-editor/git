import * as GitCleanAll from '../src/parts/GitCleanAll/GitCleanAll.js'

test('cleanAll', () => {
  expect(GitCleanAll.cleanAll()).toEqual(['clean', '--force', '.'])
})
