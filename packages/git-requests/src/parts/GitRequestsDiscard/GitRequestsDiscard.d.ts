export function discard({ cwd, gitPath, file, exec, confirm }: {
    cwd: string;
    gitPath: string;
    file: string;
    exec: any;
    confirm: any;
}): Promise<void>;
