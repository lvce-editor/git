export function getModifiedFiles({ cwd, gitPath, exec }: {
    cwd: string;
    gitPath: string;
    exec: any;
}): Promise<{
    index: any[];
    gitRoot: string;
    count: number;
}>;
