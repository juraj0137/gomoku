// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/56295f5058cac7ae458540423c50ac2dcf9fc711/node-uuid/node-uuid.d.ts
declare module __NodeUUID {

    interface UUIDOptions {
    }

    interface Buffer {
    }

    /**
     * Overloads for node environment
     * We need to duplicate some declarations because
     * interface merging doesn't work with overloads
     */
    interface UUID {
        v1(options?: UUIDOptions): string;
        v1(options?: UUIDOptions, buffer?: number[], offset?: number): number[];
        v1(options?: UUIDOptions, buffer?: Buffer, offset?: number): Buffer;

        v4(options?: UUIDOptions): string;
        v4(options?: UUIDOptions, buffer?: number[], offset?: number): number[];
        v4(options?: UUIDOptions, buffer?: Buffer, offset?: number): Buffer;

        parse(id: string, buffer?: number[], offset?: number): number[];
        parse(id: string, buffer?: Buffer, offset?: number): Buffer;

        unparse(buffer: number[], offset?: number): string;
        unparse(buffer: Buffer, offset?: number): string;
    }
}