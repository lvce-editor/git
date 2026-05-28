import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.ts'

const gitRequestEntries = Object.entries(GitRequests).filter(
  (entry: readonly [string, unknown]) => typeof entry[1] === 'function',
) as unknown as ReadonlyArray<readonly [string, (args: { readonly [key: string]: unknown }) => Promise<unknown>]>

export const wrappedGitRequests = Object.fromEntries(
  gitRequestEntries.map((entry: readonly [string, (args: { readonly [key: string]: unknown }) => Promise<unknown>]) => {
    const [key, value] = entry
    return [key, WrapGitCommand.wrapGitCommand(value)]
  }),
)
