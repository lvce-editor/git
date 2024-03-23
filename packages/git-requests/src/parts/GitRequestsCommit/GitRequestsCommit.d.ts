export function commit({ cwd, gitPath, message, exec }: {
    cwd: string;
    gitPath: string;
    message: string;
    exec: any;
}): Promise<void>;
