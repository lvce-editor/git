import type { GitErrorLike } from '../Types/Types.ts'

export const isEmptyGitRepositoryError = (error: unknown): boolean => {
  return !!error && (error as GitErrorLike).stderr === 'fatal: could not resolve HEAD'
}
