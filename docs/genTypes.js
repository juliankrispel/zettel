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
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var result = require('lodash.result');
var get = function (obj, path, _default) {
    if (_default === void 0) { _default = null; }
    return result(obj, path, _default);
};
var util = require('util');
var query = function (node, match) {
    var results = [];
    if (match(node)) {
        results.push(node);
    }
    ts.forEachChild(node, function (child) {
        results = results.concat(query(child, match));
    });
    return results;
};
function generateDocumentation(fileNames, options) {
    var program = ts.createProgram(fileNames, options);
    var checker = program.getTypeChecker();
    var docs = {
        docNodes: []
    };
    program.getSourceFiles().forEach(function (sourceFile) {
        if (!sourceFile.isDeclarationFile) {
            // First get all nodes with js doc comments
            var jsDocNodes = query(sourceFile, function (node) {
                return node.jsDoc != null;
            });
            // Now map over nodes
            docs.docNodes = docs.docNodes.concat(jsDocNodes.map(function (val) {
                var res = {};
                var varInit = get(val, 'declarationList.declarations[0].initializer');
                if (hasSignature(val)) {
                    return serializeSignature(val, checker);
                }
                else if (ts.SyntaxKind[varInit.kind] === 'ArrowFunction') {
                    return serializeArrowFunction(val, checker);
                }
                else if (ts.isTypeAliasDeclaration(val)) {
                    return serializeTypeAlias(val, checker);
                }
                else {
                    return {
                        text: val.getText()
                    };
                }
            }));
        }
    });
    return docs;
}
function serializeDocComment(node) {
    return get(node, 'jsDoc', []).map(function (doc) { return doc.comment; }).join('\n');
}
function serializeTypeAlias(node, checker) {
    return {
        // @ts-ignore
        docComment: serializeDocComment(node),
        name: get(node, 'name.getText'),
        type: serializeType(node.type, checker)
    };
}
function serializeArrowFunction(node, checker) {
    var varInit = get(node, 'declarationList.declarations[0].initializer');
    return {
        name: get(node, 'name.getText'),
        docComment: serializeDocComment(node),
        parameters: serializeParameters(varInit.parameters || [], checker),
        type: varInit.type != null ? serializeType(varInit.type, checker) : null
    };
}
function serializeSignature(node, checker) {
    // gots to return paramters and return types
    return {
        name: get(node, 'name.getText'),
        docComment: serializeDocComment(node),
        type: node.type != null ? serializeType(node.type, checker) : null,
        parameters: serializeParameters(node.parameters || [], checker)
    };
}
function serializeParameters(params, checker) {
    return params.map(function (val) { return serializeParameter(val, checker); });
}
function serializeType(node, checker) {
    var typeFromTypeNode = checker.getTypeFromTypeNode(node);
    if (ts.isTypeLiteralNode(node) ||
        ts.isPropertySignature(node)) {
        return Array.from(get(node, 'members.values', [])).reduce(function (acc, member) {
            var _a;
            return __assign({}, acc, (_a = {}, _a[get(member, 'name.getText')] = serializeType(get(member, 'type'), checker), _a));
        }, {});
    }
    else if (typeFromTypeNode.types != null && typeFromTypeNode.types.length > 0) {
        return typeFromTypeNode.types.map(
        // @ts-ignore
        function (nd) { return Array.from(get(nd, 'members.values', [])).map(function (tp) { return tp.valueDeclaration; }); }).reduce(function (acc, val) { return acc.concat(val); }, [])
            .reduce(function (acc, val) {
            var _a;
            return __assign({}, acc, (_a = {}, _a[get(val, 'name.getText', '')] = serializeType(val.type, checker), _a));
        }, {});
        // } else if (ts.SyntaxKind[node.kind] === 'TypeReference') {
        //   const typeRef =  checker.getTypeFromTypeNode(node.typeName)
        //   // debugger
        //   // @ts-ignore
        //   return Array.from(get(typeRef, 'getProperties', [])).map(tp => tp.valueDeclaration)
        //     .reduce((acc, val) => {
        //       return {
        //         ...acc,
        //         [get(val, 'name.getText', '')]: val.type.getText()
        //       }
        //     }, {})
        // return serializeType()
    }
    else if (ts.SyntaxKind[node.kind] === 'FunctionType') {
        return {
            parameters: serializeParameters(node.parameters, checker),
            type: serializeType(node.type, checker)
        };
    }
    else {
        // debugger
        return node.getText();
    }
}
function serializeParameter(param, checker) {
    return {
        isOptional: param.questionToken != null,
        name: get(param, 'name.getText'),
        type: param.type != null ? serializeType(param.type, checker) : null
    };
}
function hasSignature(node) {
    return node.parameters != null;
}
fs.writeFileSync('./types.json', JSON.stringify(generateDocumentation(['../react/src/index.tsx'], { jsx: ts.JsxEmit.React }), null, 2));
