import { visit } from 'estree-util-visit';

export const editTree = (ast, value, position) => {
  let astCopy = ast; 

  visit(astCopy, (node) => {
      if (node.type === 'Literal' && 'value' in node && node.start === position) {
          node.value = Number(value) ? Number(value) : value;
      }
  })

  return astCopy;
};
