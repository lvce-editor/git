import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as CommandType from '../CommandType/CommandType.js'
import * as Exec from '../Exec/Exec.js'

/**
 * @param {string} method
 */
export const getFn = (method) => {
  switch (method) {
    case CommandType.Exec:
      return Exec.exec
    default:
      throw new CommandNotFoundError(method)
  }
}
