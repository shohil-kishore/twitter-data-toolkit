import Operation from "./Operation";
export default class RemoveOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
    processInArray(keyword: string, source: any, _sourceArray: any[], _sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, _target: any[]): {
        resultArray: any[];
        resultArrayIndex: number;
    };
}
export declare type RemoveKeywordValue = boolean;
