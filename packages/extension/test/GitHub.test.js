import express from 'express'
import getPort from 'get-port'
import * as GitHub from '../src/parts/GitHub/GitHub.js'
import * as Platform from '../src/parts/Platform/Platform.js'

// TODO maybe use mock service worker instead of express

const runGitHubServer = async (port) => {
  const app = express()
  await new Promise((resolve) => {
    app.listen(port, () => {
      resolve(undefined)
    })
  })
  return {
    get(key, value) {
      app.get(key, value)
    },
    post(key, value) {
      app.post(key, value)
    },
    get uri() {
      return `http://localhost:${port}`
    },
  }
}

test('makePullRequest - error - no commits between main and branch', async () => {
  const port = await getPort()
  const server = await runGitHubServer(port)
  Platform.state.getGitHubBaseUrl = () => {
    return server.uri
  }
  server.post('/repos/test/test/pulls', (req, res) => {
    res.statusCode = 422
    return res.json({
      message: 'Validation Failed',
      errors: [
        {
          resource: 'PullRequest',
          code: 'custom',
          message: 'No commits between main and add-git-pull-request-command',
        },
      ],
      documentation_url:
        'https://docs.github.com/rest/reference/pulls#create-a-pull-request',
    })
  })
  await expect(
    GitHub.makePullRequest({
      base: 'main',
      head: 'feature-1',
      owner: 'test',
      repo: 'test',
    })
  ).rejects.toThrowError(
    new Error(
      'GitHub: No commits between main and add-git-pull-request-command'
    )
  )
})

test('makePullRequest - error - branch not found', async () => {
  const port = await getPort()
  const server = await runGitHubServer(port)
  Platform.state.getGitHubBaseUrl = () => {
    return server.uri
  }
  server.post('/repos/test/test/pulls', (req, res) => {
    res.statusCode = 422
    return res.json({
      url: 'https://api.github.com/repos/user/repo/pulls',
      status: 422,
      message: 'Validation Failed',
      errors: [{ resource: 'PullRequest', field: 'head', code: 'invalid' }],
      documentation_url:
        'https://docs.github.com/rest/reference/pulls#create-a-pull-request',
    })
  })
  await expect(
    GitHub.makePullRequest({
      base: 'main',
      head: 'not-found',
      owner: 'test',
      repo: 'test',
    })
  ).rejects.toThrowError(new Error("GitHub: Invalid field 'head'"))
})

test('makePullRequest - error - missing field title', async () => {
  const port = await getPort()
  const server = await runGitHubServer(port)
  Platform.state.getGitHubBaseUrl = () => {
    return server.uri
  }
  server.post('/repos/test/test/pulls', (req, res) => {
    res.statusCode = 422
    return res.json({
      url: 'https://api.github.com/repos/user/repo/pulls',
      status: 422,
      message: 'Validation Failed',
      errors: [{ resource: 'Issue', code: 'missing_field', field: 'title' }],
      documentation_url:
        'https://docs.github.com/rest/reference/pulls#create-a-pull-request',
    })
  })
  await expect(
    GitHub.makePullRequest({
      base: 'main',
      head: 'not-found',
      owner: 'test',
      repo: 'test',
    })
  ).rejects.toThrowError(new Error("GitHub: Missing field 'title'"))
})
