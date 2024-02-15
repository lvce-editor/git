import EventEmitter from 'events'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as TrackedGitRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'

export const id = ''

// export const getText = async () => {}

export const icon = '$(sync~spin)'

export const getTitle = () => {
  'Synchronize Changes'
}

const syncOperations = ['sync', 'push', 'pull', 'sync/push', 'sync/pullAndRebase']

const isSyncRunning = () => {
  return syncOperations.some(TrackedGitRequests.isRunning)
}

export const create = () => {
  const emitter = new EventEmitter()
  const handleChange = () => {
    emitter.emit('change')
  }
  return {
    emitter,
    handleChange,
  }
}

export const initialize = (state) => {
  TrackedGitRequests.onChange(state.handleChange)
}

export const dispose = (state) => {
  TrackedGitRequests.offChange(state.handleChange)
}

// TODO maybe rename to render
export const getItem = () => {
  // const currentRepository = Repositories.state.currentRepository
  // if (!currentRepository) {
  //   return {
  //     id: 'sync n/a',
  //     command: '',
  //   }
  // }
  // const icon = isSyncRunning() ? `$(sync-spin)` : `$(sync)`
  // const head = currentRepository.head
  return {
    icon,
    id: `sync head`,
  }
}
