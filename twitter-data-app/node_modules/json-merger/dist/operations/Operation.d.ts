import Processor from "../Processor";
export default abstract class Operation {
    protected _processor: Processor;
    constructor(processor: Processor);
    abstract name(): string;
    processInObject(_keyword: string, _source: any, _target: any): any;
    processInArray(keyword: string, source: any, _sourceArray: any[], _sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, _target: any[]): ProcessArrayItemResult;
}
export interface ProcessArrayItemResult {
    resultArray: any[];
    resultArrayIndex: number;
}
