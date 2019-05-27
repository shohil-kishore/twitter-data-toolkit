import { IConfig } from "./Config";
export default class Merger {
    private _config;
    private _dataDeserializer;
    private _dataLoader;
    private _dataSerializer;
    private _fileLoader;
    private _processor;
    constructor(config: Partial<IConfig>);
    mergeObject(object: object, config?: Partial<IConfig>): any;
    mergeObjects(objects: object[], config?: Partial<IConfig>): any;
    mergeFile(uri: string, config?: Partial<IConfig>): any;
    mergeFiles(uris: string[], config?: Partial<IConfig>): any;
    setConfig(config?: Partial<IConfig>): void;
    clearCaches(): void;
    private _merge;
}
