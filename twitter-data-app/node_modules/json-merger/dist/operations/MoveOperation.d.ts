import Operation from "./Operation";
export default class MoveOperation extends Operation {
    name(): string;
    processInArray(keyword: string, source: any, _sourceArray: any[], _sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, _target: any[]): {
        resultArray: any[];
        resultArrayIndex: number;
    };
}
export declare type MoveKeywordValue = IndexValue | {
    "index": IndexValue;
    "value"?: any;
};
export declare type IndexValue = number | "-";
