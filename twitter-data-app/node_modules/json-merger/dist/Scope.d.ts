export declare class ScopeBase {
    parent?: ScopeBase;
    phase: Phase;
    registeredPhases: RegisteredPhasesMap;
    propertyPath: (string | number)[];
    localVariables: Variables;
    scopeVariables: Variables;
    constructor(parent?: ScopeBase, localVariables?: Variables, phase?: Phase);
    enterProperty(propertyName?: string | number): void;
    leaveProperty(): void;
    registerPhase(phase: Phase): void;
    deregisterPhase(phase: Phase): void;
    hasRegisteredPhase(phase: Phase): boolean;
}
export declare class GlobalScope extends ScopeBase {
}
export declare class RootMergeObjectScope extends ScopeBase {
    root: RootMergeObjectScope;
    source: any;
    target: any;
    constructor(source: any, target: any, parent: ScopeBase, localVariables?: Variables, phase?: Phase);
}
export declare class MergeObjectScope extends ScopeBase {
    root: ScopeWithRoot;
    source: any;
    target: any;
    constructor(source: any, target: any, parent: ScopeWithRoot, localVariables?: Variables, phase?: Phase);
}
export declare class RootMergeFileScope extends ScopeBase {
    root: RootMergeFileScope;
    source: any;
    sourceFilePath: string;
    sourceFileName: string;
    target: any;
    constructor(sourceFilePath: string, source: any, target: any, parent: ScopeBase, localVariables?: Variables, phase?: Phase);
}
export declare class MergeFileScope extends ScopeBase {
    sourceFilePath: string;
    source: any;
    target: any;
    root: MergeFileScope;
    sourceFileName: string;
    constructor(sourceFilePath: string, source: any, target: any, parent: ScopeBase, localVariables?: Variables, phase?: Phase);
}
export declare class Scope extends ScopeBase {
    root: ScopeWithRoot;
    constructor(parent: ScopeWithRoot, localVariables?: Variables, phase?: Phase);
}
export declare type ScopeWithRoot = RootMergeFileScope | RootMergeObjectScope | MergeFileScope | MergeObjectScope | Scope;
export declare type AnyScope = GlobalScope | ScopeWithRoot;
export declare const enum Phase {
    AfterMerge = "afterMerge",
    AfterMerges = "afterMerges",
    Merge = "merge"
}
export interface RegisteredPhasesMap {
    [phase: string]: boolean;
}
export interface Variables {
    [name: string]: any;
}
