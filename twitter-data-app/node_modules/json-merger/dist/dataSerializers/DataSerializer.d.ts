export default class DataSerializer {
    private _serializers;
    serialize(uri: string, data: any, pretty: boolean): any;
    addSerializer(serializer: DataSerializerInterface): void;
    addSerializers(serializers: DataSerializerInterface[]): void;
}
export interface DataSerializerInterface {
    match(uri: string): boolean;
    serialize(uri: string, data: any, pretty: boolean): string;
}
