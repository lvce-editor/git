import EventEmitter from 'events'
// import * as Repositories from '../GitRepositories/GitRepositories.js'

export const id = 'main'

export const icon = '$(source-control)'

export const create = () => {
  const emitter = new EventEmitter()

  const handleChange = () => {
    emitter.emit('change')
  }

  return {
    addListener: emitter.addListener.bind(emitter),
    initialize() {
      Repositories.addListener('didChangeRepository', handleChange)
    },
    dispose() {
      Repositories.removeListener('didChangeRepository', handleChange)
    },
    getItem() {
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
    },
  }
}
