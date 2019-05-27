import Operation, { ProcessArrayItemResult } from "./Operation";
export default class IncludeOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
    processInArray(keyword: string, source: any, sourceArray: any[], sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, target: any[]): ProcessArrayItemResult;
}
export declare type IncludeKeywordValue = string;
