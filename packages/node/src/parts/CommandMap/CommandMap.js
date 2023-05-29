import * as CommandType from '../CommandType/CommandType.js'
import * as Exec from '../Exec/Exec.js'

/**
 * @param {string} method
 */
export const commandMap = {
  [CommandType.Exec]: Exec.exec,
}
