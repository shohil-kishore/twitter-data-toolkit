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
var Operation_1 = require("./Operation");
var Scope_1 = require("../Scope");
var SelectOperation = (function (_super) {
    __extends(SelectOperation, _super);
    function SelectOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectOperation.prototype.name = function () {
        return "select";
    };
    SelectOperation.prototype.processInObject = function (keyword, source, target) {
        var keywordValue = source[keyword];
        var value;
        var selectContext;
        var scope = this._processor.currentScope;
        if (scope instanceof Scope_1.RootMergeFileScope || scope instanceof Scope_1.RootMergeObjectScope) {
            selectContext = scope.source;
        }
        else {
            selectContext = scope.root;
        }
        if (typeof keywordValue === "string") {
            value = this._processor.resolveJsonPointer(selectContext, keywordValue);
        }
        else {
            if (keywordValue.from !== undefined) {
                selectContext = this._processor.processSourceProperty(keywordValue.from, "from");
            }
            if (typeof keywordValue.path === "string") {
                value = this._processor.resolveJsonPointer(selectContext, keywordValue.path);
            }
            else if (typeof keywordValue.query === "string") {
                value = this._processor.resolveJsonPath(selectContext, keywordValue.query);
                if (keywordValue.multiple !== true) {
                    value = value[0];
                }
            }
        }
        return this._processor.processSource(value, target);
    };
    return SelectOperation;
}(Operation_1.default));
exports.default = SelectOperation;
//# sourceMappingURL=SelectOperation.js.map