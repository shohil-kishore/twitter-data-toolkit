import Operation from "./Operation";
export default class RepeatOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export interface RepeatKeywordValue {
    "from"?: number;
    "in"?: object | any[];
    "range"?: string;
    "step"?: number;
    "through"?: number;
    "to"?: number;
    "value": any;
}
