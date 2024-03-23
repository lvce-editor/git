export function deleteBranch({ cwd, gitPath, exec }: {
    cwd: string;
    gitPath: string;
    name: string;
    exec: any;
}): Promise<void>;
