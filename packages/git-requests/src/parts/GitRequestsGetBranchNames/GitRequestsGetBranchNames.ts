import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const getBranchNames = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<readonly string[]> => {
  try {
    const gitResult = await exec({
      args: ['branch', '-a'],
      cwd,
      gitPath,
      name: 'getBranchNames',
    })
    const branchNames = gitResult.stdout.split('\n')
    return branchNames
  } catch (error) {
    throw new GitError(error, 'getBranchNames')
  }
}
