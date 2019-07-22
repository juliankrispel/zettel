import * as ts from "typescript";
import * as fs from "fs";

const result = require('lodash.result');
const get = (obj, path, _default = null) => result(obj, path, _default)
const util = require('util')

const query = (
  node: ts.Node,
  match: (node: ts.Node) => boolean
): ts.Node[] => {
  let results: ts.Node[] = []
  if (match(node)) {
    results.push(node)
  }
  ts.forEachChild(node, (child) => {
    results = results.concat(query(child, match))
  })

  return results
}

function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions
): Object {
  let program = ts.createProgram(fileNames, options);
  const checker = program.getTypeChecker();
  const docs = {
    docNodes: [],
  }

  program.getSourceFiles().forEach(sourceFile => {
    if (!sourceFile.isDeclarationFile) {
      // First get all nodes with js doc comments
      const jsDocNodes = query(sourceFile, (node: any) => {
        return node.jsDoc != null
      })

      // Now map over nodes
      docs.docNodes = docs.docNodes.concat(jsDocNodes.map(val => {
        let res = {}
        const varInit = get(val, 'declarationList.declarations[0].initializer')

        if (hasSignature(val)) {
          return serializeSignature(val, checker)
        } else if (ts.SyntaxKind[varInit.kind] === 'ArrowFunction') {
          return serializeArrowFunction(val, checker)
        } else if (ts.isTypeAliasDeclaration(val)) {
          return serializeTypeAlias(val, checker)
        } else {
          return {
            text: val.getText()
          }
        }
      }))
    }
  })

  return docs
}

function serializeDocComment(node) {
  return get(node, 'jsDoc', []).map(doc => doc.comment).join('\n')
}

function serializeTypeAlias(node: ts.TypeAliasDeclaration, checker) {
  return {
    // @ts-ignore
    docComment: serializeDocComment(node),
    name: get(node, 'name.getText'),
    type: serializeType(node.type, checker),
  }
}

function serializeArrowFunction(node, checker: ts.TypeChecker) {
  const varInit = get(node, 'declarationList.declarations[0].initializer')

  return {
    name: get(node, 'name.getText'),
    docComment: serializeDocComment(node),
    parameters: serializeParameters(varInit.parameters || [], checker),
    type: varInit.type != null ? serializeType(varInit.type, checker) : null,
  }
}

function serializeSignature(node, checker) {
  // gots to return paramters and return types
  return {
    name: get(node, 'name.getText'),
    docComment: serializeDocComment(node),
    type: node.type != null ? serializeType(node.type, checker) : null,
    parameters: serializeParameters(node.parameters || [], checker)
  }
}

function serializeParameters(params: ts.ParameterDeclaration[], checker) {
  return params.map((val) => serializeParameter(val, checker))
}

function serializeType(node: any, checker) {
  const typeFromTypeNode = checker.getTypeFromTypeNode(node)

  if (
    ts.isTypeLiteralNode(node) ||
    ts.isPropertySignature(node)
  ) {
    return Array.from(get(node, 'members.values', [])).reduce((acc, member) => {
      return {
        ...acc,
        [get(member, 'name.getText')]: serializeType(get(member, 'type'), checker)
      }
    }, {})
  } else if (typeFromTypeNode.types != null && typeFromTypeNode.types.length > 0) {
    return typeFromTypeNode.types.map(
      // @ts-ignore
      nd => Array.from(get(nd, 'members.values', [])).map(tp => tp.valueDeclaration)
    ).reduce((acc, val) => acc.concat(val), [])
    .reduce((acc, val) => {
      return {
        ...acc,
        [get(val, 'name.getText', '')]: serializeType(val.type, checker)
      }
    }, {})
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
  } else if (ts.SyntaxKind[node.kind] === 'FunctionType') {
    return {
      parameters: serializeParameters(node.parameters, checker),
      type: serializeType(node.type, checker)
    }
  } else {
    // debugger
    return node.getText()
  }
}

function serializeParameter(param: ts.ParameterDeclaration, checker) {
  return {
    isOptional: param.questionToken != null,
    name: get(param, 'name.getText'),
    type: param.type != null ? serializeType(param.type, checker) : null
  }
}

function hasSignature(node) {
  return node.parameters != null
}

fs.writeFileSync(
  './types.json',
  JSON.stringify(
    generateDocumentation(
      ['../react/src/index.tsx'],
      { jsx: ts.JsxEmit.React }
    ),
    null,
    2
  )
)
