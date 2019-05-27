import Operation from "./Operation";
export default class AppendOperation extends Operation {
    name(): string;
    processInArray(keyword: string, source: any, _sourceArray: any[], _sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, _target: any[]): {
        resultArray: any[];
        resultArrayIndex: number;
    };
}
export declare type AppendKeywordValue = any;
