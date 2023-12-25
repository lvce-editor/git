import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'
/**
 *
 * @param {{cwd:string,gitPath:string , file:string }} options
 */
export const add = WrapGitCommand.wrapGitCommand(GitRequests.add)
