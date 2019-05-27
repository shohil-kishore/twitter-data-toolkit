import Config from "./Config";
import DataDeserializer from "./dataDeserializers/DataDeserializer";
import FileLoader from "./fileLoaders/FileLoader";
export default class DataLoader {
    private _config;
    private _dataDeserializer;
    private _fileLoader;
    private _cache;
    constructor(_config: Config, _dataDeserializer: DataDeserializer, _fileLoader: FileLoader);
    load(uri: string, currentUri: string): any;
    toAbsoluteUri(uri: string, currentUri: string): string | undefined;
    clearCache(): void;
}
