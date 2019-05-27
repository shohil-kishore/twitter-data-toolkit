import Operation from "./Operation";
export default class ConcatOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any[];
}
export declare type ConcatKeywordValue = any;
