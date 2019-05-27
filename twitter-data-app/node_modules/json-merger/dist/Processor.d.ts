import { Phase, AnyScope } from "./Scope";
import Config from "./Config";
import DataLoader from "./DataLoader";
import Operation, { ProcessArrayItemResult } from "./operations/Operation";
export default class Processor {
    private _config;
    private _dataLoader;
    currentScope: AnyScope;
    private _cache;
    private _enabledOperationNames;
    private _nameOperationMap;
    private _operationNames;
    constructor(_config: Config, _dataLoader: DataLoader);
    merge(sources: Source[]): any;
    mergeFile(uri: string, target?: any, scopeVariables?: any): any;
    mergeObject(source: any, target?: any, scopeVariables?: any, phase?: Phase): any;
    addOperation(operation: Operation): void;
    addOperations(operations: Operation[]): void;
    enableOperations(): void;
    disableOperations(): void;
    getKeyword(operationName: string): string;
    isKeyword(input: string): boolean;
    isEscapedKeyword(input: string): boolean;
    stripOperationPrefix(input: string): string;
    startsWithOperationPrefix(input: string): boolean;
    getCurrentUri(): string;
    loadFile(uri: string): any;
    loadFileByRef(ref: string): any;
    loadAndProcessFile(uri: string, target?: any, scopeVariables?: any, isRoot?: boolean): any;
    loadAndProcessFileByRef(ref: string, target?: any, scopeVariables?: object, isRoot?: boolean): any;
    processSourcePropertyInNewMergeObjectScope(sourceProperty: any, sourcePropertyName: string, targetProperty?: any, scopeVariables?: any): any;
    processSourcePropertyInNewScope(sourceProperty: any, sourcePropertyName: string, targetProperty?: any, scopeVariables?: any): any;
    processSourceProperty(sourceProperty: any, sourcePropertyName: string, targetProperty?: any): any;
    processSource(source: any, target?: any): any;
    private _processObject;
    private _processArray;
    processArrayItem(source: any, sourceArray: any[], sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, target: any[]): ProcessArrayItemResult;
    resolveJsonPointer(target: object, pointer?: string): any;
    resolveJsonPath(target: object, path?: string): any;
    private _enterScope;
    private _leaveScope;
}
export declare const enum SourceType {
    Object = 0,
    Uri = 1
}
export interface UriSource {
    uri: string;
    type: SourceType.Uri;
}
export interface ObjectSource {
    object: object;
    type: SourceType.Object;
}
export declare type Source = UriSource | ObjectSource;
