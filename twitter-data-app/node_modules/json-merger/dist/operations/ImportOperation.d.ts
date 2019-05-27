import Operation from "./Operation";
export default class ImportOperation extends Operation {
    name(): string;
    processInObject(keyword: string, source: any, target?: any): any;
}
export declare type ImportKeywordValue = string | {
    path: string;
    params?: any;
};
