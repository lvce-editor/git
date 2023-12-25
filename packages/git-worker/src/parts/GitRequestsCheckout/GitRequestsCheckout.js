import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'

/**
 * @param {{cwd:string, ref:string, gitPath:string  }} options
 */
export const checkout = WrapGitCommand.wrapGitCommand(GitRequests.checkout)
