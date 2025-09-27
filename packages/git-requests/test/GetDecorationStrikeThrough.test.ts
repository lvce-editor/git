import * as FileStateType from '../src/parts/FileStateType/FileStateType.js'
import * as GetDecorationStrikeThrough from '../src/parts/GetDecorationStrikeThrough/GetDecorationStrikeThrough.js'

test('getDecorationStrikeThrough - both deleted', () => {
  expect(GetDecorationStrikeThrough.getDecorationStrikeThrough(FileStateType.BothDeleted)).toBe(true)
})

test('getDecorationStrikeThrough - index added', () => {
  expect(GetDecorationStrikeThrough.getDecorationStrikeThrough(FileStateType.IndexAdded)).toBe(false)
})
