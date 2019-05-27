export default class FileLoader {
    private _uriCache;
    private _loaders;
    load(uri: string, currentUri: string): string;
    addLoader(loader: FileLoaderInterface, priority: number): void;
    addLoaders(loaders: [FileLoaderInterface, number][]): void;
    toAbsoluteUri(uri: string, currentUri: string): string | undefined;
    clearCache(): void;
}
export interface FileLoaderInterface {
    load(uri: string): string;
    match(uri: string, currentUri: string): boolean;
    toAbsoluteUri(uri: string, currentUri: string): string;
}
