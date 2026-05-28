import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.ts'

const gitRequestEntries = Object.entries(GitRequests).filter((entry) => typeof entry[1] === 'function') as unknown as ReadonlyArray<
  readonly [string, (args: Readonly<Record<string, any>>) => Promise<any>]
>

export const wrappedGitRequests = Object.fromEntries(
  gitRequestEntries.map(([key, value]) => {
    return [key, WrapGitCommand.wrapGitCommand(value)]
  }),
)
