export default class Config implements IConfig {
    cwd: string;
    errorOnFileNotFound: boolean;
    errorOnRefNotFound: boolean;
    operationPrefix: string;
    params: any;
    stringify: boolean | "pretty";
    constructor(config?: Partial<IConfig>);
    set(config?: Partial<IConfig>): void;
}
export interface IConfig {
    cwd: string;
    errorOnFileNotFound: boolean;
    errorOnRefNotFound: boolean;
    operationPrefix: string;
    params: any;
    stringify: boolean | "pretty";
}
