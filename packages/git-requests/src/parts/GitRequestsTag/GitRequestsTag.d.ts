export function tag({ cwd, gitPath, tag, exec }: {
    cwd: string;
    gitPath: string;
    tag: string;
    exec: any;
}): Promise<void>;
