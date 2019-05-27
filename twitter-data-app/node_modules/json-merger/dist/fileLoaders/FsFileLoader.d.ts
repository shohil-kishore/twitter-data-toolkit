import { FileLoaderInterface } from "./FileLoader";
export default class FsFileLoader implements FileLoaderInterface {
    match(uri: string, currentUri: string): boolean;
    toAbsoluteUri(uri: string, currentUri: string): string;
    load(uri: string): string;
}
