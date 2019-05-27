import Operation from "./Operation";
export default class MatchOperation extends Operation {
    name(): string;
    processInArray(keyword: string, source: any, sourceArray: any[], sourceArrayIndex: number, resultArray: any[], resultArrayIndex: number, target: any[]): {
        resultArray: any[];
        resultArrayIndex: number;
    };
}
export interface MatchKeywordValue {
    "index"?: number | "-";
    "path"?: string;
    "query"?: string;
    "value": any;
}
