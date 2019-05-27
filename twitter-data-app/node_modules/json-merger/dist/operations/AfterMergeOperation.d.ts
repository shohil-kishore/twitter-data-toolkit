import Operation from "./Operation";
export default class AfterMergeOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export declare type AfterMergeKeywordValue = any;
