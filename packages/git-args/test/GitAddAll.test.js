import * as GitAddAll from '../src/parts/GitAddAll/GitAddAll.js'

test('addAll', () => {
  expect(GitAddAll.addAll()).toEqual(['add', '.'])
})
