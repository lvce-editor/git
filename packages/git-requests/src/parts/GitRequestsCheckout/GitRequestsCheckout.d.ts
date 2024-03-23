export function checkout({ cwd, gitPath, ref, exec }: {
    cwd: string;
    ref: string;
    gitPath: string;
    exec: any;
}): Promise<void>;
