import Operation from "./Operation";
export default class AfterMergesOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export declare type AfterMergesKeywordValue = any;
