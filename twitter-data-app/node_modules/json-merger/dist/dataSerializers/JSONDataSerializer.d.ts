import { DataSerializerInterface } from "./DataSerializer";
export default class JSONDataSerializer implements DataSerializerInterface {
    match(uri: string): boolean;
    serialize(_: string, data: any, pretty: boolean): string;
}
