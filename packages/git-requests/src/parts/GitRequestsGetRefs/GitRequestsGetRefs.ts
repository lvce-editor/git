import type { GitRef, GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import * as ParseGitRefs from '../ParseGitRefs/ParseGitRefs.ts'

// cspell:ignore authorname committerdate
const format = [
  '%(refname)',
  '%(objectname)',
  '%(*objectname)',
  '%(symref:short)',
  '%(committerdate:relative)',
  '%(authorname)',
  '%(subject)',
  '%(*committerdate:relative)',
  '%(*authorname)',
  '%(*subject)',
].join('%00')

export const getRefs = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<readonly GitRef[]> => {
  try {
    const gitResult = await exec({
      args: ['for-each-ref', '--format', format],
      cwd,
      gitPath,
      name: 'getRefs',
    })
    return ParseGitRefs.parseGitRefs(gitResult.stdout)
  } catch (error) {
    throw new GitError(error, 'getRefs')
  }
}
