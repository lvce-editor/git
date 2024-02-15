import EventEmitter from 'events'
// import * as Repositories from '../GitRepositories/GitRepositories.js'

export const id = 'git.sync'

const isSyncRunning = () => {
  for (const running of Repositories.state.running) {
    switch (running) {
      case 'Sync':
      case 'Push':
      case 'Pull':
        return true
    }
  }
  return false
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
  Repositories.addListener('didChangeOperations', state.handleChange)
  Repositories.addListener('didRunGitStatus', state.handleChange)
}

export const dispose = (state) => {
  Repositories.removeListener('didChangeOperations', state.handleChange)
  Repositories.removeListener('didRunGitStatus', state.handleChange)
}

// TODO maybe rename to render
export const getItem = (state) => {
  const currentRepository = Repositories.state.currentRepository
  if (!currentRepository) {
    return {
      id: 'sync n/a',
    }
  }
  const icon = isSyncRunning() ? `$(sync)` : `$(sync-spin)`
  const head = currentRepository.head
  return {
    icon,
    id: head,
  }
}
