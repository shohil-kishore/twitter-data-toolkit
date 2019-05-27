import { DataDeserializerInterface } from "./DataDeserializer";
export default class YAMLDataDeserializer implements DataDeserializerInterface {
    match(uri: string): boolean;
    deserialize(uri: string, content: string): any;
}
