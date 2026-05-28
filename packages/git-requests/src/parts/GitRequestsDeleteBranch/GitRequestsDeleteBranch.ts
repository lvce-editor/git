import { GitError } from '../GitError/GitError.ts'
import type { GitRequestContext } from '../Types/Types.ts'

type DeleteBranchOptions = GitRequestContext & {
  readonly name: string
}

export const deleteBranch = async ({ cwd, gitPath, exec, name }: DeleteBranchOptions): Promise<void> => {
  try {
    const gitResult = await exec({
      args: ['branch', '-d', name],
      cwd,
      gitPath,
      name: 'deleteBranch',
    })
  } catch (error) {
    throw new GitError(error, 'deleteBranch')
  }
}
