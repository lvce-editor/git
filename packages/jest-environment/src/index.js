import { ModuleMocker } from 'jest-mock'
import { createContext, runInContext } from 'node:vm'

class VError extends Error {
  constructor(error, message) {
    super(message)
  }
}

const api = {
  VError,
}

export default class CustomEnvironment {
  constructor() {
    this.global = globalThis
    this.global.vscode = api
    this.context = createContext(this.global)
    this.moduleMocker = new ModuleMocker(this.global)
  }

  setup() {}

  teardown() {
    this.context = null
  }

  getVmContext() {
    return this.context
  }
}
