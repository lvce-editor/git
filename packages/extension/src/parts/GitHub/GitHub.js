import * as Platform from '../Platform/Platform.js'

const getErrorMessageFromResponseData = (responseData) => {
  let message = ''
  if (responseData.message && responseData.message !== 'Validation Failed') {
    message = responseData.message
  }
  if (responseData.errors && responseData.errors.length > 0) {
    const firstError = responseData.errors[0]
    if (firstError.message) {
      message += `: ${firstError.message}`
    } else if (firstError.field && firstError.code) {
      switch (firstError.code) {
        case 'missing_field':
          message += `: Missing field '${firstError.field}'`
          break
        case 'invalid':
          message += `: Invalid field '${firstError.field}'`
          break
        default:
          message += `: Issue with field '${firstError.field}'`
          break
      }
    }
  }
  message = 'GitHub' + message
  return message
}

export const makePullRequest = async ({ base, head, owner, repo }) => {
  const { Octokit } = await import('@octokit/rest')
  const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH,
    baseUrl: Platform.getGitHubBaseUrl(),
  })
  try {
    const { data } = await octokit.rest.pulls.create({
      base,
      head,
      owner,
      repo,
      title: head,
    })
  } catch (error) {
    if (
      error &&
      error.name === 'HttpError' &&
      error.response &&
      error.response.data &&
      error.response.data.errors
    ) {
      const errorMessage = getErrorMessageFromResponseData(error.response.data)
      throw new Error(errorMessage, {
        cause: error,
      })
    } else {
      console.log('else case', error.name)
      throw error
    }
  }
}
