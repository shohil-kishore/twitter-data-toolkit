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
var ReplaceOperation = (function (_super) {
    __extends(ReplaceOperation, _super);
    function ReplaceOperation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReplaceOperation.prototype.name = function () {
        return "replace";
    };
    ReplaceOperation.prototype.processInObject = function (keyword, source, _target) {
        var keywordValue = source[keyword];
        return this._processor.processSource(keywordValue);
    };
    return ReplaceOperation;
}(Operation_1.default));
exports.default = ReplaceOperation;
//# sourceMappingURL=ReplaceOperation.js.map