export type GitStatusGroup = {
  readonly id: string
  readonly label: string
  readonly items: readonly unknown[]
}

export type GitRepositoryState = {
  readonly groups: readonly GitStatusGroup[]
  readonly uri: string
}

export type GitState = {
  readonly gitPath: string
  readonly gitRepositories: readonly GitRepositoryState[]
  readonly parsedGitVersion: string
  readonly rawGitVersion: string
}

const states: Record<string, GitState> = Object.create(null)

const emptyGroups: readonly GitStatusGroup[] = []

const getRepositoryIndex = (repositories: readonly GitRepositoryState[], uri: string): number => {
  return repositories.findIndex((repository) => repository.uri === uri)
}

const upsertRepository = (repositories: readonly GitRepositoryState[], repository: GitRepositoryState): readonly GitRepositoryState[] => {
  const index = getRepositoryIndex(repositories, repository.uri)
  if (index === -1) {
    return [...repositories, repository]
  }
  const currentRepository = repositories[index]
  if (currentRepository === repository) {
    return repositories
  }
  return repositories.map((item, itemIndex) => {
    if (itemIndex === index) {
      return repository
    }
    return item
  })
}

export const get = (applicationId: string): GitState | undefined => {
  return states[applicationId]
}

export const set = (applicationId: string, gitState: GitState): GitState => {
  states[applicationId] = gitState
  return gitState
}

export const reset = (): void => {
  for (const key of Object.keys(states)) {
    delete states[key]
  }
}

export const setGitState = (
  applicationId: string,
  gitState: Readonly<{
    readonly gitPath: string
    readonly parsedGitVersion: string
    readonly rawGitVersion: string
  }>,
): GitState => {
  const currentState = get(applicationId)
  const nextState: GitState = {
    gitPath: gitState.gitPath,
    gitRepositories: currentState?.gitRepositories || [],
    parsedGitVersion: gitState.parsedGitVersion,
    rawGitVersion: gitState.rawGitVersion,
  }
  return set(applicationId, nextState)
}

export const ensureRepository = (applicationId: string, uri: string): GitState | undefined => {
  const currentState = get(applicationId)
  if (!currentState) {
    return currentState
  }
  const existingRepository = currentState.gitRepositories.find((repository) => repository.uri === uri)
  if (existingRepository) {
    return currentState
  }
  return set(applicationId, {
    ...currentState,
    gitRepositories: [...currentState.gitRepositories, { groups: emptyGroups, uri }],
  })
}

export const setRepositoryGroups = (applicationId: string, uri: string, groups: readonly GitStatusGroup[]): GitState | undefined => {
  const currentState = get(applicationId)
  if (!currentState) {
    return currentState
  }
  const nextRepository: GitRepositoryState = {
    groups,
    uri,
  }
  return set(applicationId, {
    ...currentState,
    gitRepositories: upsertRepository(currentState.gitRepositories, nextRepository),
  })
}
