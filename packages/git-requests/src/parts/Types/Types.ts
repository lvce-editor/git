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
  readonly gitPath: string
  readonly exec: GitExec
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
