export function unstage({ cwd, gitPath, file, exec }: {
    cwd: string;
    gitPath: string;
    file: string;
    exec: any;
}): Promise<void>;
