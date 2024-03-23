export function addAllAndCommit({ cwd, gitPath, message, exec }: {
    cwd: string;
    message: string;
    gitPath: string;
    exec: any;
}): Promise<void>;
