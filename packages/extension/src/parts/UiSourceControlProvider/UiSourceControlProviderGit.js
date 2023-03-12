import * as Exec from '../Exec/Exec.js'
// import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'
// import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.js'
// import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.js'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'

export const id = 'git'

export const label = 'Git'

// export const acceptInput = CommandAcceptInput.execute

// export const add = CommandAdd.execute

// export const discard = CommandAdd.execute

export const isActive = async (scheme, root) => {
  if (scheme !== '') {
    return false
  }
  try {
    const {} = await Exec.exec('git', ['rev-parse', '--git-dir'], {
      cwd: root,
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export const getBadgeCount = async (cwd) => {
  return 0
}

export const getChangedFiles = async (cwd) => {
  const indexWithDecorations = await GetChangedFiles.getChangedFiles(cwd)
  return indexWithDecorations
}

// export const fetch = CommandFetch

export const statusBarCommands = []
