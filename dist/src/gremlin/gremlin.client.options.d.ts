export declare enum ChannelType {
    websocket = "websocket",
    rest = "rest",
}
export declare class GremlinClientOptions {
    port: number;
    host: string;
    path: string;
    language: string;
    useSession: boolean;
    ssl: boolean;
    rejectUnauthorized: boolean;
    accept: string;
    processor: string;
    channelType: ChannelType;
    user: string;
    password: string;
    setPath(path: any): void;
    constructor(options?: any);
}
