import { ScopeBase } from "./Scope";
export default class MergerError extends Error {
    constructor(originalError: Error, scope: ScopeBase);
    private _createMessage;
    private _createProcessingStackTrace;
}
