export function getGroups({ exec, getRepository }: {
    exec: any;
    getRepository: any;
}): Promise<{
    id: string;
    label: string;
    items: any[];
}[]>;
