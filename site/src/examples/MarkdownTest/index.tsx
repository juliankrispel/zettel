import * as React from 'react';
import { useState } from 'react'
import { EditorState, Fragment, valueToText, TextCharacter, createTextFragments } from '@zettel/core'
import Editor, { EditorText } from '@zettel/react'
import prism from 'prismjs'
import './prism.css'

const text = `[# Some markdown]
[\`\`\`js\nconsole.log('boom')\nfunction sum(a,b){\n  return a + b;\n}]
[> And here's a block quote]
`

const processToken = (token: any, value: TextCharacter[]) => {
  if (typeof token === 'string') {
    token.split('').forEach(_char => {
      const char: TextCharacter  = {
        char: _char
      }
      value.push(char)
    })
  } else if (token != null && Array.isArray(token.content)) {
    token.content.forEach((_tok: any) => processToken(_tok, value))
  } else if (token != null && token.content != null) {
    token.content.toString().split('').forEach((_char: string) => {
      const char: TextCharacter  = {
        styles: [token.type],
        char: _char
      }
      value.push(char)
    })
  }
}

const Code = (props: any) => {
  const { block, children } = props
  const text = valueToText(block.value.slice(3))
  const matches = text.match(/^([a-z]+)\s/)
  if (matches != null && prism.languages[matches[1]] != null) {
    const value: TextCharacter[] = block.value.slice(0, 3 + matches[0].length)
    const actualText = text.substr(matches[0].length)
    const tokens = prism.tokenize(actualText, prism.languages[matches[1]])
    tokens.forEach((token) => processToken(token, value))

    block.fragments = createTextFragments(value)
    return <pre style={{ color: 'white', background: 'black', padding: '1em'}}>
      <EditorText {...props} block={block} />
    </pre>
  } else {
    return <pre>
      {children}
    </pre>
  }
}

const reduceToText = (fragments: Fragment[]): string => {
  return fragments.reduce((currentText, fragment) => {
    if ('fragments' in fragment) {
      return currentText + reduceToText(fragment.fragments)
    } else {
      return currentText + fragment.text
    }
  }, '')
}

const App = () => {
  const [editorState, setEditorState] = useState(() => EditorState.fromJSON({
    text,
    ranges: [],
  }))

  return (
    <Editor
      htmlAttrs={{ spellCheck: false, autoFocus: true, className: 'editor'}}
      onChange={setEditorState}
      renderStyle={(props) => {
        return <span className={`token ${props.style}`}>{props.children}</span>
      }}
      renderBlock={(props) => {
        const { htmlAttrs, children, block } = props
        const text = reduceToText(block.fragments)

        if (text.startsWith('# ')) {
          return <h1 {...htmlAttrs}>{children}</h1>
        }

        if (text.startsWith('## ')) {
          return <h2 {...htmlAttrs}>{children}</h2>
        }

        if (text.startsWith('### ')) {
          return <h3 {...htmlAttrs}>{children}</h3>
        }

        if (text.startsWith('> ')) {
          return <blockquote {...htmlAttrs}>{children}</blockquote>
        }

        if (text.startsWith('```')) {
          return <Code {...props} />
        }

        return <div {...htmlAttrs}>{children}</div>
      }}
      editorState={editorState}
    />
  );
}

export default App;
