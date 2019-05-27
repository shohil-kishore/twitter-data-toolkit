import Operation from "./Operation";
export default class ExpressionOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export declare type ExpressionKeywordValue = string | {
    "expression": string;
    "input"?: any;
};
