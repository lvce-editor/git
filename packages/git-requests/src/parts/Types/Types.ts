export type GitExecOptions = {
  readonly args: readonly string[]
  readonly cwd: string
  readonly gitPath: string
  readonly name: string
  readonly input?: string
  readonly throwError?: boolean
}

export type GitExecResult = {
  readonly stdout: string
  readonly stderr: string
}

export type GitExec = (options: GitExecOptions) => Promise<GitExecResult> | GitExecResult

export type GitRepository = {
  readonly gitPath: string
  readonly path: string
  readonly gitVersion?: string
}

export type GetRepository = () => Promise<GitRepository>

export type GitRequestContext = {
  readonly cwd: string
  readonly exec: GitExec
  readonly gitPath: string
}

export type GitFileRequest = GitRequestContext & {
  readonly file: string
}

export type GitMessageRequest = GitRequestContext & {
  readonly message: string
}

export type GitRefRequest = GitRequestContext & {
  readonly ref: string
}

export type GitWorktreeRequest = GitRequestContext & {
  readonly worktreePath: string
  readonly ref?: string
}

export type GitNameRequest = GitRequestContext & {
  readonly name: string
}

export type GitTagRequest = GitRequestContext & {
  readonly tag: string
}

export type GitKeyValueRequest = GitRequestContext & {
  readonly key: string
  readonly value: string
}

export type GitRemoteRequest = GitRequestContext & {
  readonly name: string
  readonly url: string
}

export type GitInitRequest = GitRequestContext & {
  readonly bare?: boolean
  readonly initialBranch?: string
}

export type GitStashRequest = GitRequestContext & {
  readonly message?: string
}

export type GitApplyStashRequest = GitRequestContext & {
  readonly stashReference?: string
}

export type GitUnstashRequest = GitRequestContext & {
  readonly stashReference?: string
}

export type GitErrorLike = Error & {
  readonly code?: string
  readonly stderr?: string
}

export type GitCommit = {
  readonly hash: string
  readonly message: string
}

export type GitRef = {
  readonly name: string
  readonly commit: string
  readonly type: number
  readonly remote: string
  readonly symbolicRef?: string
}

export type GitStatusFile = {
  readonly file: string
  readonly status: number
}

export type GitStatusGroupResult<T extends GitStatusFile = GitStatusFile> = {
  readonly indexGroup: readonly T[]
  readonly mergeGroup: readonly T[]
  readonly workingTreeGroup: readonly T[]
  readonly untrackedGroup: readonly T[]
}

export type GitStatusResult = {
  readonly index: readonly GitStatusFile[]
  readonly gitRoot: string
  readonly count: number
}

export type GitDecoration = GitStatusFile & {
  readonly icon: number
  readonly iconTitle: string
  readonly strikeThrough: boolean
}
