const handleGitStatus = () => {
  console.info('')
}

const handleGitAdd = () => {
  console.error(`On branch main
nothing to commit, working tree clean`)
  process.exit(128)
}

switch (process.argv[2]) {
  case 'status':
    handleGitStatus()
    break
  case 'add':
    handleGitAdd()
    break
  default:
    throw new Error(`unexpected invocation ${process.argv[1]}`)
}

export {}
