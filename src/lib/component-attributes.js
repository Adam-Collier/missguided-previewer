import { visit } from 'estree-util-visit';

export const getComponentAttributes = (ast) => {
  let components = [];

  visit(ast, (node) => {
    if(!node) return;

    if (node.type === 'JSXOpeningElement') {
      // get the component name from the opening tags
      let componentName = node.name.name;
      // check if the opening tag has props (referred her as attributes)
      let componentProps = {};

      if (node.attributes) {
        // loop over each prop and get its name and value
        node.attributes.forEach((attribute) => {
          if (!attribute.value) return {};

          console.log(node);

          let value = attribute.value.expression
              ? attribute.value.expression.value
              : attribute.value.value;

          componentProps[attribute.name.name] = {
            value,
            type: typeof value,
            position: attribute.value.expression ? attribute.value.expression.start: attribute.value.start,
          };
        });
      }

      components.push({
        name: componentName,
        props: componentProps,
      });
    }

  })

  return components;
};
