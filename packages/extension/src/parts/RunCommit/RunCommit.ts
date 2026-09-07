import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export interface CommitOptions {
  readonly all?: boolean
  readonly postCommitCommand?: string
}

export interface CommitDependencies {
  readonly executeCommand: (id: string, options: unknown) => Promise<unknown>
  readonly getPreference: (key: string) => Promise<unknown>
  readonly getWorkspaceFolder: () => Promise<string>
  readonly invoke: (id: string, options: Readonly<Record<string, unknown>>) => Promise<any>
  readonly refresh: () => Promise<void>
  readonly refreshCheckout: () => Promise<void>
  readonly setSpinning: (value: boolean) => Promise<void>
  readonly showQuickInput: (options: { readonly placeholder: string; readonly value: string }) => Promise<string | undefined>
}

const prepareBranch = async (cwd: string, dependencies: CommitDependencies): Promise<string | false | undefined> => {
  if ((await dependencies.getPreference('git.branchProtection')) === false) {
    return undefined
  }
  const branch = await dependencies.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
  if (branch.trim() !== 'main') {
    return undefined
  }
  const choice = await dependencies.executeCommand('Dialog.showMessageBox', {
    buttons: ['Commit Anyway', 'Cancel', 'Commit to a New Branch'],
    defaultId: 2,
    message: 'You are trying to commit to a protected branch. How would you like to proceed?',
    type: 'warning',
  })
  if (choice !== 0 && choice !== 2) {
    return false
  }
  let newBranch: string | undefined
  if (choice === 2) {
    newBranch = await dependencies.showQuickInput({
      placeholder: "Please provide a new branch name (Press 'Enter' to confirm or 'Escape' to cancel)",
      value: 'feature/',
    })
    if (!newBranch) {
      return false
    }
  }
  const currentBranch = await dependencies.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
  if (currentBranch.trim() !== 'main') {
    throw new Error('The current branch changed while confirming the commit. Please try again.')
  }
  return newBranch
}

const runPostCommitAction = async (cwd: string, action: unknown, newBranch: string | undefined, dependencies: CommitDependencies): Promise<void> => {
  if (action !== 'push' && action !== 'sync') {
    return
  }
  if (newBranch) {
    await dependencies.invoke(GitWorkerCommandType.GitPush, { cwd, setUpstream: ['origin', newBranch] })
    return
  }
  const command = action === 'push' ? GitWorkerCommandType.GitPush : GitWorkerCommandType.GitSync
  await dependencies.invoke(command, { cwd })
}

export const runCommit = async (message: string, options: CommitOptions, dependencies: CommitDependencies): Promise<void> => {
  const cwd = await dependencies.getWorkspaceFolder()
  const postCommitCommand = options.postCommitCommand
  const newBranch = await prepareBranch(cwd, dependencies)
  if (newBranch === false) {
    return
  }
  try {
    await dependencies.setSpinning(true)
    if (newBranch) {
      await dependencies.invoke(GitWorkerCommandType.GitCheckout, { create: true, cwd, ref: newBranch })
      await dependencies.refreshCheckout()
    }
    const command = options.all ? GitWorkerCommandType.GitAddAllAndCommit : GitWorkerCommandType.GitCommit
    await dependencies.invoke(command, options.all ? { cwd, message, newBranch, push: !postCommitCommand } : { cwd, message })
    await runPostCommitAction(cwd, postCommitCommand, newBranch, dependencies)
  } finally {
    try {
      await dependencies.refresh()
    } finally {
      await dependencies.setSpinning(false)
    }
  }
}
