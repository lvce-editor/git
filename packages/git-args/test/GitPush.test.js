import * as GitPush from '../src/parts/GitPush/GitPush.js'

test('push', () => {
  expect(GitPush.push()).toEqual(['push'])
})
