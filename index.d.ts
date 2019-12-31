/// <reference types="node" />
import { InspectOptions } from 'util';
import { Transform } from 'stream';
declare type TInspectFunction = (object: any, options?: InspectOptions) => string;
declare type TStringifyFunction = (object: any) => string;
export declare type TCustomInspectFunction = (options?: InspectOptions) => string;
export declare type TCustomStringifyFunction = () => string;
declare type TClass = {
    prototype: any;
};
declare const $context: unique symbol;
export declare type TContext = {
    [$context]: true;
    [key: string]: any;
};
interface IReplacer {
    (context: TContext, message: string, options?: InspectOptions | boolean): string;
    stream: (context: TContext, options?: InspectOptions | boolean) => Transform;
    inspector: TInspectFunction;
    stringifier: TStringifyFunction;
    customizeInspector: (Class: TClass, inspect: TCustomInspectFunction) => void;
    customizeStringifier: (Class: TClass, uninspect: TCustomStringifyFunction) => void;
    readonly inspect: TInspectFunction;
    readonly stringify: TStringifyFunction;
    contextualize(object: any): any;
    isContextualize(object: any): boolean;
}
declare const _default: IReplacer;
export default _default;
