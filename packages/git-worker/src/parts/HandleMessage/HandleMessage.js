import * as GetResponse from '../GetResponse/GetResponse.js'
import * as Id from '../Id/Id.js'
import * as Callback from '../Callback/Callback.js'

export const handleMessage = async (event) => {
  const message = event.data
  console.log({ message })
  if ('id' in message) {
    Id.maybeIncrement(message.id)
    if ('result' in message || 'error' in message) {
      Callback.resolve(message.id, message)
    } else if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      event.target.postMessage(response)
    }
  }
}
