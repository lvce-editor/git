import type { GitRef, GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import * as ParseGitRefs from '../ParseGitRefs/ParseGitRefs.ts'

export const getRefs = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<readonly GitRef[]> => {
  try {
    const gitResult = await exec({
      args: ['for-each-ref', '--format', '%(refname) %(objectname) %(*objectname) %(symref:short)'],
      cwd,
      gitPath,
      name: 'getRefs',
    })
    return ParseGitRefs.parseGitRefs(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getRefs')
  }
}
