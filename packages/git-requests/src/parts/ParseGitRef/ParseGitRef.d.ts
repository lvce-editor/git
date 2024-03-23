export function parseGitRef(line: string): {
    name: string;
    commit: string;
    type: number;
    remote: string;
} | null;
