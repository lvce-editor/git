import * as HandleMessage from './parts/HandleMessage/HandleMessage.js'

const main = () => {
  console.log('hello from git worker')
  onmessage = HandleMessage.handleMessage
}

main()
