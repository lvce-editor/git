import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export const getCurrentBranch = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<string> => {
  let gitResult
  try {
    gitResult = await exec({
      args: ['branch', '--show-current'],
      cwd,
      gitPath,
      name: 'getCurrentBranch',
    })
  } catch (error) {
    throw new GitError(error, 'getCurrentBranch')
  }

  const branch = gitResult.stdout
  return branch
}
