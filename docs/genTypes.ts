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

  return Array.from(program.getSourceFiles()).map((sourceFile: any) => {
    if (!sourceFile.isDeclarationFile) {
      // First get all nodes with js doc comments
      const jsDocNodes = query(sourceFile, (node: any) => {
        return node.jsDoc != null
      })

      // Now map over nodes
      return {
        file: sourceFile.fileName,
        nodes: jsDocNodes.map(val => {
          let res = {}
          const varInit = get(val, 'declarationList.declarations[0].initializer', {})

          if (hasSignature(val)) {
            return serializeSignature(val, checker)
          } else if (ts.SyntaxKind[varInit.kind] === 'ArrowFunction') {
            return serializeArrowFunction(val, checker)
          } else if (ts.isTypeAliasDeclaration(val)) {
            return serializeTypeAlias(val, checker)
          } else {
            return {
              kind: ts.SyntaxKind[val.kind],
              text: val.getText()
            }
          }
        })
      }
    }
  }).filter(val => val != null && val.nodes != null && val.nodes.length > 0)
}

function serializeDocComment(node) {
  return get(node, 'jsDoc', []).map(doc => doc.comment).join('\n')
}

function serializeTypeAlias(node: ts.TypeAliasDeclaration, checker) {
  return {
    // @ts-ignore
    docComment: serializeDocComment(node),
    kind: ts.SyntaxKind[node.kind],
    name: get(node, 'name.getText'),
    type: serializeType(node.type, checker),
  }
}

function serializeArrowFunction(node, checker: ts.TypeChecker) {
  const varInit = get(node, 'declarationList.declarations[0].initializer')

  return {
    name: get(node, 'name.getText'),
    kind: ts.SyntaxKind[node.kind],
    docComment: serializeDocComment(node),
    parameters: serializeParameters(varInit.parameters || [], checker),
    type: varInit.type != null ? serializeType(varInit.type, checker) : null,
  }
}

function serializeSignature(node, checker) {
  // gots to return paramters and return types
  return {
    name: get(node, 'name.getText'),
    kind: ts.SyntaxKind[node.kind],
    docComment: serializeDocComment(node),
    type: node.type != null ? serializeType(node.type, checker) : null,
    parameters: serializeParameters(node.parameters || [], checker)
  }
}

function serializeParameters(params: ts.ParameterDeclaration[], checker) {
  return params.map((val) => serializeParameter(val, checker))
}

const builtInTypes = [
  'UnionType',
  'BooleanKeyword',
  'FunctionType',
  'NumberKeyword',
  'ArrayType',
  'ObjectKeyword'
]

function serializeType(node: any, checker) {
  const typeFromTypeNode = checker.getTypeFromTypeNode(node)
  console.log(ts.SyntaxKind[node.kind])

  if (
    ts.isTypeLiteralNode(node) ||
    ts.isPropertySignature(node)
  ) {
    return Array.from(get(node, 'members.values', [])).reduce((acc, member) => {
      // @ts-ignore
      console.log(member.name.getText())
      return {
        ...acc,
        // @ts-ignore
        [member.name.getText()]: serializeType(get(member, 'type'), checker)
      }
    }, {})
  } else if (ts.SyntaxKind[node.kind] !== 'TypeReference') {
    return node.getText()
  } else if (ts.SyntaxKind[node.kind] === 'FunctionType') {
    return {
      parameters: serializeParameters(node.parameters, checker),
      type: serializeType(node.type, checker)
    }
  } else if (typeFromTypeNode.types != null && typeFromTypeNode.types.length > 0) {
    return typeFromTypeNode.types.map(
      // @ts-ignore
      nd => Array.from(get(nd, 'members.values', [])).map(tp => tp.valueDeclaration)
    ).reduce((acc, val) => acc.concat(val), [])
    .reduce((acc, val) => {
      return {
        ...acc,
        [val.name.getText()]: serializeType(val.type, checker)
      }
    }, {})
    // return serializeType()
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
      ['../react/src/index.tsx', '../core/src/index.ts'],
      { jsx: ts.JsxEmit.React }
    ),
    null,
    2
  )
)
