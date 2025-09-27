import { GitWebExec } from '../GitWebExec/GitWebExec.js'

// Test the git-web functionality
const testGitWeb = async () => {
  console.log('Testing git-web functionality...')

  try {
    // Test git --version
    const versionResult = await GitWebExec.exec('git', ['--version'], { cwd: 'web://test' })
    console.log('Git version:', versionResult.stdout)

    // Test git status
    const statusResult = await GitWebExec.exec('git', ['status'], { cwd: 'web://test' })
    console.log('Git status:', statusResult.stdout)

    // Test git init
    const initResult = await GitWebExec.exec('git', ['init'], { cwd: 'web://test' })
    console.log('Git init:', initResult.stdout)

    console.log('All tests passed!')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGitWeb()
}
