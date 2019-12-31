"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var vm_1 = require("vm");
var stream_1 = require("stream");
var $context = Symbol('context');
var $inspect = Symbol('custom_inspect');
var $stringify = Symbol('custom-uninspect');
var REX_PH_STRING = /%%|%([\s\u0021-\u0024\u0026-\uffff]|%{2,})+%(?!%)/g;
var REX_PH_STREAM = /(%%)|(%([\s\u0021-\u0024\u0026-\uffff]|%{2,})+%)|(%([\s\u0021-\u0024\u0026-\uffff]|%{2,})*$)/g;
var _inspect = util_1.inspect;
var _stringify = function (object) { return object.toString(); };
function parse_expression(context, expr, options) {
    expr = '(' + expr.substr(1, expr.length - 2).replace(/%%/g, '%') + ')';
    var val = vm_1.runInContext(expr, context);
    if (options === true)
        options = {};
    return options ?
        (val[$inspect] ? val[$inspect](val, options) : _inspect(val, options)) :
        (val[$stringify]) ? val[$stringify](val) : _stringify(val);
}
function inspect(object, options) {
    return (object[$inspect] ? object[$inspect](object, options) : _inspect(object, options));
}
function stringify(object) {
    return (object[$stringify]) ? object[$stringify](object) : _stringify(object);
}
var Replacer = (function (_super) {
    __extends(Replacer, _super);
    function Replacer(context, options) {
        var _this = _super.call(this) || this;
        if (!context[$context])
            context = contextualize(context);
        _this._context = context;
        _this._options = options;
        return _this;
    }
    Replacer.prototype._transform = function (chunk, encoding, callback) {
        if (encoding === 'buffer')
            encoding = undefined;
        if (this._rest) {
            chunk = this._rest + chunk.toString(encoding);
            this._rest = '';
        }
        else {
            chunk = chunk.toString(encoding);
        }
        var m;
        var from = 0;
        var out = '';
        REX_PH_STREAM.lastIndex = 0;
        while ((m = REX_PH_STREAM.exec(chunk)) != null) {
            if (m.index > from)
                out += chunk.substr(from, m.index - from);
            if (m[4]) {
                this._rest = m[0];
                from = chunk.length;
                break;
            }
            out += parse_expression(this._context, m[0], this._options);
            from = m.index + m[0].length;
        }
        if (from < chunk.length)
            out += chunk.substr(from);
        this.push(out);
        callback();
    };
    return Replacer;
}(stream_1.Transform));
function replacer(context, message, options) {
    if (options === true)
        options = {};
    if (!context[$context])
        context = contextualize(context);
    REX_PH_STRING.lastIndex = 0;
    return message.replace(REX_PH_STRING, function (m) {
        if (m === '%%')
            return '%';
        return parse_expression(context, m, options);
    });
}
function stream(context, options) {
    if (options === void 0) { options = false; }
    return new Replacer(context, options);
}
function customizeInspector(Class, inspect) {
    if (Class.prototype)
        Class.prototype[$inspect] = inspect;
    else
        throw new Error("No tiene prototipo");
}
function customizeStringifier(Class, stringify) {
    if (Class.prototype)
        Class.prototype[$stringify] = stringify;
    else
        throw new Error("No tiene prototipo");
}
function contextualize(object) {
    if (object[$context])
        return object;
    object[$context] = true;
    return vm_1.createContext(object);
}
function isContextualize(object) {
    return object[$context];
}
exports.default = Object.defineProperties(replacer, {
    stream: {
        value: stream,
        enumerable: true,
        writable: false,
        configurable: false
    },
    inspector: {
        get: function () { return _inspect; },
        set: function (val) {
            _inspect = val;
        },
        enumerable: true,
        configurable: false
    },
    stringifier: {
        get: function () { return _stringify; },
        set: function (val) {
            _stringify = val;
        },
        enumerable: true,
        configurable: false
    },
    customizeInspector: {
        value: customizeInspector,
        enumerable: true,
        writable: false,
        configurable: false
    },
    customizeStringifier: {
        value: customizeStringifier,
        enumerable: true,
        writable: false,
        configurable: false
    },
    inspect: {
        value: inspect,
        enumerable: true,
        writable: false,
        configurable: false
    },
    stringify: {
        value: stringify,
        enumerable: true,
        writable: false,
        configurable: false
    },
    contextualize: {
        value: contextualize,
        enumerable: true,
        writable: false,
        configurable: false
    },
    isContextualize: {
        value: isContextualize,
        enumerable: true,
        writable: false,
        configurable: false
    }
});
//# sourceMappingURL=index.js.map