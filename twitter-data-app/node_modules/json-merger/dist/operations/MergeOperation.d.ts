import Operation from "./Operation";
export default class MergeOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export interface MergeKeywordValue {
    "source": any;
    "with": any;
}
