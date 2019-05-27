import { DataDeserializerInterface } from "./DataDeserializer";
export default class JSONDataDeserializer implements DataDeserializerInterface {
    match(uri: string): boolean;
    deserialize(_: string, content: string): any;
}
