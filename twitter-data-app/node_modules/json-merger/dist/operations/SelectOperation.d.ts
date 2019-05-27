import Operation from "./Operation";
export default class SelectOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export declare type SelectKeywordValue = string | {
    "from"?: any;
    "multiple"?: boolean;
    "path"?: string;
    "query"?: string;
};
