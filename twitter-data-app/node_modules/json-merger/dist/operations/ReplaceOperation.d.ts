import Operation from "./Operation";
export default class ReplaceOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, _target?: any): any;
}
export declare type ReplaceKeywordValue = any;
