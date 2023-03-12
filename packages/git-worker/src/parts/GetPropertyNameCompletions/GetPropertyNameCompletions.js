import { propertyData } from '../../../data/propertyData.js'
import * as TokenType from '../CssTokenType/CssTokenType.js'
import { tokenizeCss } from '../TokenizeCss/TokenizeCss.js'
// {
//   none: {},
//   overline: {},
//   underline: {},
//   'line-through': {},
// },

const toSnippet = (propertyName) => {
  return {
    label: propertyName,
    snippet: `${propertyName}: `,
    kind: /* Property */ 1,
  }
}

const COMPLETIONS_CSS_PROPERTY_NAME = Object.keys(propertyData).map(toSnippet)

export const getPropertyNameCompletions = () => {
  return COMPLETIONS_CSS_PROPERTY_NAME
}
