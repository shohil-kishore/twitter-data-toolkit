import Operation from "./Operation";
export default class PrependOperation extends Operation {
    name(): string;
    processInArray(keyword: string, source: any, _sourceArray: any[], _sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, _target: any[]): {
        resultArray: any[];
        resultArrayIndex: number;
    };
}
export declare type PrependKeywordValue = any;
