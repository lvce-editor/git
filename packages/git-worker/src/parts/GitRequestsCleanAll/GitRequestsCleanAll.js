import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'

/**
 *
 * @param {{cwd:string,gitPath:string }} options
 */
export const cleanAll = WrapGitCommand.wrapGitCommand(GitRequests.cleanAll)
