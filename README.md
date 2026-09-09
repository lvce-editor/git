# Git

Git integration for Lvce editor.

## Branch protection

`git.branchProtection` is enabled by default. Committing on `main` opens a dialog with **Commit Anyway**, **Cancel**, and **Commit to a New Branch**.

The new-branch input starts with `feature/`. Enter creates and checks out the branch, then commits. Commit & Sync and source-control auto-push publish the new branch and set its upstream. Escape cancels the input.

Set `git.branchProtection` to `false` in settings to disable the dialog.

## Contributing

```sh
git clone git@github.com:lvce-editor/git.git &&
cd git &&
npm ci &&
npm test
```

## Credits

This extension is based on https://github.com/microsoft/vscode/tree/main/extensions/git by Microsoft (License MIT)

### Git over Remote SSH regression

Build this extension with `npm run build`, then run `LVCE_REMOTE_SSH_TEST_REPO=/absolute/path/to/remote-ssh npm run e2e:remote-ssh` on Linux. Install dependencies in both repositories first. The Remote SSH checkout must support `LVCE_REMOTE_SSH_TEST_GIT_EXTENSION_PATH` and `LVCE_REMOTE_SSH_TEST_GIT_SCENARIO`. OpenSSH server and Playwright Chromium are required.

The test reuses Remote SSH's temporary SSH server and editor harness, installs this Git build on both ends, and verifies branch display, remote changes, staging and unstaging, and remote Node process routing.
