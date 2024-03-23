export const id: "git";
export const label: "Git";
export function getChangedFiles({ getRepository, exec }: {
    getRepository: any;
    exec: any;
}): Promise<any>;
