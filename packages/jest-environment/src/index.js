globalThis.vscode = {}

export default class CustomEnvironment {
  global = {
    vscode: 123,
  }

  moduleMocker = null

  constructor(config, context) {
    this.context = context
    console.log('created custom environment')
  }

  getVmContext() {
    return this.context
  }
}
