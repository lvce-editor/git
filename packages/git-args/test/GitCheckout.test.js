import * as GitCheckout from '../src/parts/GitCheckout/GitCheckout.js'

test('checkout', () => {
  expect(
    GitCheckout.checkout({
      ref: 'main',
    }),
  ).toEqual(['checkout', 'main'])
})
