import { useState, useEffect } from 'react';
import { getComponentAttributes } from '../../lib/component-attributes';
// import { prettyPrint } from 'recast';
import { editTree } from '../../lib/edit-tree';

export const FormEditor = ({ ast, setAST, handleAST }) => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    setComponents(getComponentAttributes(ast));
  }, [ast]);

  let handleChange = (e, position) => {
    let updatedAST = editTree(ast, e.target.value, position);
    setAST({ ...updatedAST });
  };

  return components.map((component, index) => {

    let { name, props } = component;

    // generate the forms
    // when we edit the input change the ast
    // re render the forms

    return (
      <div key={index}>
        <p>{name}</p>
        {Object.entries(props).map(([name, prop], index) => (
          <label htmlFor={name} key={index}>
            {name}
            <input
              type={prop.type}
              name={name}
              value={prop.value}
              onChange={(e) => handleChange(e, prop.position)}
            />
          </label>
        ))}
      </div>
    );
  });
};
