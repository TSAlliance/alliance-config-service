
export type MigrationAction = "UPDATE_FIELD_ID" | "UPDATE_DATA_TYPE";

export interface Migration {
    delete: Array<string>;
    add: Array<{ path: string, value: any }>;
    update: Array<{ path: string, action: MigrationAction, value: any }>
}