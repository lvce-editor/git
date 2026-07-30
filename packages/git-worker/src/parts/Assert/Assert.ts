// TODO treeshake out this whole module in production

import { AssertionError } from '../AssertionError/AssertionError.ts'

const getType = (value: unknown): string => {
  switch (typeof value) {
    case 'boolean':
      return 'boolean'
    case 'function':
      return 'function'
    case 'number':
      return 'number'
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        return 'array'
      }
      if (value instanceof Uint32Array) {
        return 'uint32array'
      }
      return 'object'
    case 'string':
      return 'string'
    default:
      return 'unknown'
  }
}

export const object = (value: unknown): void => {
  const type = getType(value)
  if (type !== 'object') {
    throw new AssertionError('expected value to be of type object')
  }
}

export const array = (value: unknown): void => {
  const type = getType(value)
  if (type !== 'array') {
    throw new AssertionError('expected value to be of type array')
  }
}

export const string = (value: unknown): void => {
  const type = getType(value)
  if (type !== 'string') {
    throw new AssertionError('expected value to be of type string')
  }
}
