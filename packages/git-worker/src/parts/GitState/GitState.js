export const state = {
  /**
   * @type {any[]}
   */
  repositories: [],
}

export const addRepository = (repository) => {
  state.repositories.push(repository)
}
