import EventEmitter from 'events'
// import * as Repositories from '../GitRepositories/GitRepositories.js'

export const id = 'main'

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
  Repositories.addListener('didChangeRepository', state.handleChange)
}

export const dispose = (state) => {
  Repositories.removeListener('didChangeRepository', state.handleChange)
}

export const getItem = (state) => {
  if (!Repositories.state.currentRepository) {
    return {
      id: 'n/a',
      icon: '$(source-control)',
    }
  }
  return {
    id: 'main',
    icon: '$(source-control)',
  }
}
