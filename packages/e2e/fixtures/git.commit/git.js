const handleGitStatus = () => {
  console.info('')
}

const handleGitAdd = () => {
  process.exit(0)
}

const handleGitCommit = () => {
  process.exit(0)
}

const handleGitPush = () => {
  process.exit(0)
}

switch (process.argv[2]) {
  case 'status':
    handleGitStatus()
    break
  case 'add':
    handleGitAdd()
    break
  case 'commit':
    handleGitCommit()
    break
  case 'push':
    handleGitPush()
    break
  default:
    throw new Error(`unexpected invocation ${process.argv[1]}`)
}

export {}
