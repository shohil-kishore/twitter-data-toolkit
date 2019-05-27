"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var jsonpath = require("jsonpath");
var jsonPtr = require("json-ptr");
var types_1 = require("./utils/types");
var Scope_1 = require("./Scope");
var Processor = (function () {
    function Processor(_config, _dataLoader) {
        this._config = _config;
        this._dataLoader = _dataLoader;
        this._cache = [];
        this._enabledOperationNames = [];
        this._nameOperationMap = {};
        this._operationNames = [];
        this._enabledOperationNames = this._operationNames;
    }
    Processor.prototype.merge = function (sources) {
        var _this = this;
        var scopeVariables = {
            $params: this._config.params
        };
        var scope = new Scope_1.GlobalScope();
        this._enterScope(scope);
        var result = sources.reduce(function (target, source) {
            if (source.type === 0) {
                target = _this.mergeObject(source.object, target, scopeVariables);
            }
            else if (source.type === 1) {
                target = _this.mergeFile(source.uri, target, scopeVariables);
            }
            return target;
        }, undefined);
        if (scope.hasRegisteredPhase("afterMerges")) {
            result = this.mergeObject(result, undefined, scopeVariables, "afterMerges");
        }
        this._leaveScope();
        return result;
    };
    Processor.prototype.mergeFile = function (uri, target, scopeVariables) {
        return this.loadAndProcessFileByRef(uri, target, scopeVariables, true);
    };
    Processor.prototype.mergeObject = function (source, target, scopeVariables, phase) {
        var scope = new Scope_1.RootMergeObjectScope(source, target, this.currentScope, scopeVariables, phase);
        this._enterScope(scope);
        var result = this.processSource(source, target);
        this._leaveScope();
        if (scope.hasRegisteredPhase("afterMerge")) {
            result = this.mergeObject(result, target, scopeVariables, "afterMerge");
        }
        return result;
    };
    Processor.prototype.addOperation = function (operation) {
        var name = operation.name();
        this._nameOperationMap[name] = operation;
        this._operationNames.push(name);
    };
    Processor.prototype.addOperations = function (operations) {
        var _this = this;
        operations.forEach(function (operation) { return _this.addOperation(operation); });
    };
    Processor.prototype.enableOperations = function () {
        this._enabledOperationNames = this._operationNames;
    };
    Processor.prototype.disableOperations = function () {
        this._enabledOperationNames = [];
    };
    Processor.prototype.getKeyword = function (operationName) {
        return this._config.operationPrefix + operationName;
    };
    Processor.prototype.isKeyword = function (input) {
        if (!this.startsWithOperationPrefix(input)) {
            return false;
        }
        var name = this.stripOperationPrefix(input);
        return this._nameOperationMap[name] !== undefined;
    };
    Processor.prototype.isEscapedKeyword = function (input) {
        return this.isKeyword(this.stripOperationPrefix(input));
    };
    Processor.prototype.stripOperationPrefix = function (input) {
        return input.substr(this._config.operationPrefix.length);
    };
    Processor.prototype.startsWithOperationPrefix = function (input) {
        var prefix = this._config.operationPrefix;
        return input.substr(0, prefix.length) === prefix;
    };
    Processor.prototype.getCurrentUri = function () {
        var scope = this.currentScope;
        if (scope.root && scope.root.sourceFilePath) {
            return scope.root.sourceFilePath;
        }
        else if (this._config.cwd !== "") {
            return path.join(this._config.cwd, "object.json");
        }
        return path.join(process.cwd(), "object.json");
    };
    Processor.prototype.loadFile = function (uri) {
        return this._dataLoader.load(uri, this.getCurrentUri());
    };
    Processor.prototype.loadFileByRef = function (ref) {
        var _a = ref.split("#"), uri = _a[0], pointer = _a[1];
        var result = this.loadFile(uri);
        if (pointer !== undefined) {
            result = this.resolveJsonPointer(result, pointer);
        }
        return result;
    };
    Processor.prototype.loadAndProcessFile = function (uri, target, scopeVariables, isRoot) {
        if (isRoot === void 0) { isRoot = false; }
        var currentUri = this.getCurrentUri();
        var absoluteUri = this._dataLoader.toAbsoluteUri(uri, currentUri);
        var usedScopeVariables = scopeVariables;
        if (usedScopeVariables === undefined && this.currentScope) {
            usedScopeVariables = this.currentScope.localVariables;
        }
        var hashedScopeVariables = JSON.stringify(usedScopeVariables);
        var cacheItem = this._cache
            .filter(function (x) { return (x.absoluteUri === absoluteUri
            && x.target === target
            && x.hashedScopeVariables === hashedScopeVariables); })[0];
        if (cacheItem) {
            if (cacheItem.executeAfterMergesPhase) {
                this.currentScope.registerPhase("afterMerges");
            }
            return cacheItem.result;
        }
        var source = this._dataLoader.load(absoluteUri, currentUri);
        scopeVariables = scopeVariables || {};
        if (!scopeVariables.$params) {
            scopeVariables.$params = this.currentScope.scopeVariables.$params;
        }
        var scope;
        if (isRoot) {
            scope = new Scope_1.RootMergeFileScope(absoluteUri, source, target, this.currentScope, scopeVariables, this.currentScope.phase);
        }
        else {
            scope = new Scope_1.MergeFileScope(absoluteUri, source, target, this.currentScope, scopeVariables, this.currentScope.phase);
        }
        this._enterScope(scope);
        var result = this.processSource(source, target);
        if (scope.hasRegisteredPhase("afterMerge")) {
            var mergeObjectScope = new Scope_1.MergeObjectScope(result, undefined, scope, scopeVariables, "afterMerge");
            this._enterScope(mergeObjectScope);
            result = this.processSource(result);
            this._leaveScope();
        }
        this._leaveScope();
        var executeAfterMergesPhase = scope.hasRegisteredPhase("afterMerges");
        this._cache.push({ absoluteUri: absoluteUri, target: target, hashedScopeVariables: hashedScopeVariables, result: result, executeAfterMergesPhase: executeAfterMergesPhase });
        return result;
    };
    Processor.prototype.loadAndProcessFileByRef = function (ref, target, scopeVariables, isRoot) {
        if (isRoot === void 0) { isRoot = false; }
        var _a = ref.split("#"), uri = _a[0], pointer = _a[1];
        var result = this.loadAndProcessFile(uri, target, scopeVariables, isRoot);
        if (pointer !== undefined) {
            result = this.resolveJsonPointer(result, pointer);
        }
        return result;
    };
    Processor.prototype.processSourcePropertyInNewMergeObjectScope = function (sourceProperty, sourcePropertyName, targetProperty, scopeVariables) {
        var scope = new Scope_1.MergeObjectScope(sourceProperty, targetProperty, this.currentScope, scopeVariables);
        this._enterScope(scope);
        var result = this.processSourceProperty(sourceProperty, sourcePropertyName, targetProperty);
        this._leaveScope();
        return result;
    };
    Processor.prototype.processSourcePropertyInNewScope = function (sourceProperty, sourcePropertyName, targetProperty, scopeVariables) {
        var scope = new Scope_1.Scope(this.currentScope, scopeVariables);
        this._enterScope(scope);
        var result = this.processSourceProperty(sourceProperty, sourcePropertyName, targetProperty);
        this._leaveScope();
        return result;
    };
    Processor.prototype.processSourceProperty = function (sourceProperty, sourcePropertyName, targetProperty) {
        this.currentScope.enterProperty(sourcePropertyName);
        var result = this.processSource(sourceProperty, targetProperty);
        this.currentScope.leaveProperty();
        return result;
    };
    Processor.prototype.processSource = function (source, target) {
        if (types_1.isObject(source)) {
            return this._processObject(source, target);
        }
        else if (Array.isArray(source)) {
            return this._processArray(source, target);
        }
        return source;
    };
    Processor.prototype._processObject = function (source, target) {
        var _this = this;
        for (var i = 0; i < this._enabledOperationNames.length; i++) {
            var name_1 = this._enabledOperationNames[i];
            var operation = this._nameOperationMap[name_1];
            var keyword = this.getKeyword(name_1);
            if (source[keyword] !== undefined) {
                this.currentScope.enterProperty(keyword);
                var result_1 = operation.processInObject(keyword, source, target);
                this.currentScope.leaveProperty();
                return result_1;
            }
        }
        if (!types_1.isObject(target)) {
            target = {};
        }
        var result = __assign({}, target);
        Object.keys(source).forEach(function (key) {
            if (_this.stripOperationPrefix(key) === "comment") {
                return;
            }
            var targetKey = _this.isEscapedKeyword(key) ? _this.stripOperationPrefix(key) : key;
            result[targetKey] = _this.processSourceProperty(source[key], key, target[key]);
            if (typeof result[targetKey] === "undefined") {
                delete result[targetKey];
            }
        });
        return result;
    };
    Processor.prototype._processArray = function (source, target) {
        var _this = this;
        target = (Array.isArray(target) ? target : []);
        var processResult = {
            resultArray: target.slice(),
            resultArrayIndex: -1
        };
        source.forEach(function (sourceItem, sourceItemIndex) {
            _this.currentScope.enterProperty(sourceItemIndex);
            processResult = _this.processArrayItem(sourceItem, source, sourceItemIndex, processResult.resultArray, processResult.resultArrayIndex + 1, target);
            _this.currentScope.leaveProperty();
        });
        return processResult.resultArray;
    };
    Processor.prototype.processArrayItem = function (source, sourceArray, sourceArrayIndex, resultArray, resultArrayIndex, target) {
        if (types_1.isObject(source)) {
            for (var i = 0; i < this._enabledOperationNames.length; i++) {
                var name_2 = this._enabledOperationNames[i];
                var operation = this._nameOperationMap[name_2];
                var keyword = this.getKeyword(name_2);
                if (source[keyword] !== undefined) {
                    this.currentScope.enterProperty(keyword);
                    var result = operation.processInArray(keyword, source, sourceArray, sourceArrayIndex, resultArray, resultArrayIndex, target);
                    this.currentScope.leaveProperty();
                    return result;
                }
            }
        }
        resultArray[resultArrayIndex] = this.processSource(source, resultArray[resultArrayIndex]);
        return { resultArray: resultArray, resultArrayIndex: resultArrayIndex };
    };
    Processor.prototype.resolveJsonPointer = function (target, pointer) {
        var result;
        if (pointer === undefined || pointer === "/") {
            result = target;
        }
        else {
            result = jsonPtr.get(target, pointer);
        }
        if (result === undefined && this._config.errorOnRefNotFound) {
            throw new Error("The JSON pointer \"" + pointer + "\" resolves to undefined. Set Config.errorOnRefNotFound to false to suppress this message");
        }
        return result;
    };
    Processor.prototype.resolveJsonPath = function (target, path) {
        var result;
        if (path === undefined) {
            result = target;
        }
        else if (types_1.isObject(target) || Array.isArray(target)) {
            result = jsonpath.query(target, path);
        }
        if (this._config.errorOnRefNotFound && (result === undefined || result.length === 0)) {
            throw new Error("The JSON path \"" + path + "\" resolves to undefined. Set Config.errorOnRefNotFound to false to suppress this message");
        }
        return result;
    };
    Processor.prototype._enterScope = function (scope) {
        this.currentScope = scope;
        return this.currentScope;
    };
    Processor.prototype._leaveScope = function () {
        var currentScope = this.currentScope;
        this.currentScope = this.currentScope.parent;
        return currentScope;
    };
    return Processor;
}());
exports.default = Processor;
var SourceType;
(function (SourceType) {
    SourceType[SourceType["Object"] = 0] = "Object";
    SourceType[SourceType["Uri"] = 1] = "Uri";
})(SourceType = exports.SourceType || (exports.SourceType = {}));
//# sourceMappingURL=Processor.js.map