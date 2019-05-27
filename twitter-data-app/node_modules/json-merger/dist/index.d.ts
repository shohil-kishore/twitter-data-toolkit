import Merger from "./Merger";
import { IConfig } from "./Config";
export declare function mergeObject(object: object, config?: Partial<IConfig>): any;
export declare function mergeObjects(objects: object[], config?: Partial<IConfig>): any;
export declare function mergeFile(file: string, config?: Partial<IConfig>): any;
export declare function mergeFiles(files: string[], config?: Partial<IConfig>): any;
export { Merger };
export default Merger;
