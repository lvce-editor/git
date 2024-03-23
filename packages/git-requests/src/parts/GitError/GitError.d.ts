export class GitError extends Error {
    constructor(error: any, command: any);
    stderr: any;
    isExpected: boolean;
}
