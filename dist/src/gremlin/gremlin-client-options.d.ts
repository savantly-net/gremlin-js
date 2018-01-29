export declare class GremlinClientOptions {
    port: number;
    host: string;
    path: string;
    language: string;
    useSession: boolean;
    ssl: boolean;
    rejectUnauthorized: boolean;
    op: string;
    accept: string;
    processor: string;
    user: string;
    password: string;
    aliases: string;
    setPath(path: any): void;
    constructor();
}
