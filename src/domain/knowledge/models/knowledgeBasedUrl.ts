export namespace KnowledgeBasedUrl {
    export const TableName = 'knowledgeBasedUrls';

    export type T = {
        id: number;

        url: string;

        description: string | null;
        note: string | null;

        createdAt: Date;
        updatedAt: Date;
    };

    export type viewT = Omit<
        T,
        'id'
    >;

    export type backofficeViewT = T;

    export type storeT = Omit<
        T,
        'id' |
        'createdAt' |
        'updatedAt'
    >;

    export type updateT = Partial<Omit<
        T,
        'id' |
        'createdAt' |
        'updatedAt'
    >>;

}