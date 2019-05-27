export default class DataDeserializer {
    private _deserializers;
    deserialize(uri: string, content: string): any;
    addDeserializer(deserializer: DataDeserializerInterface): void;
    addDeserializers(deserializers: DataDeserializerInterface[]): void;
}
export interface DataDeserializerInterface {
    deserialize(uri: string, content: string): any;
    match(uri: string): boolean;
}
