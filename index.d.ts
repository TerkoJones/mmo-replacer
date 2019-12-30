/// <reference types="node" />
import { InspectOptions } from 'util';
import { Context } from 'vm';
import { Transform } from 'stream';
declare type TInspectFunction = (object: any, options?: InspectOptions) => string;
declare type TStringifyFunction = (object: any) => string;
declare type TCustomInspectFunction = (options?: InspectOptions) => string;
declare type TCustomStringifyFunction = () => string;
declare type TClass = {
    prototype: any;
};
interface IReplacer {
    (sandbox: object, message: string, options?: InspectOptions | false): string;
    stream: (sandbox: Context, options?: InspectOptions | boolean) => Transform;
    inspector: TInspectFunction;
    stringifier: TStringifyFunction;
    customizeInspector: (Class: TClass, inspect: TCustomInspectFunction) => void;
    customizeStringifier: (Class: TClass, uninspect: TCustomStringifyFunction) => void;
    readonly inspect: TInspectFunction;
    readonly stringify: TStringifyFunction;
}
declare const _default: IReplacer;
export default _default;
