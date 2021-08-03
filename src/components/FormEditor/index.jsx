import { useState, useEffect } from 'react';
import { getComponentAttributes } from '../../lib/component-attributes';
// import { prettyPrint } from 'recast';
import { editTree } from '../../lib/edit-tree';
import s from './formeditor.module.css';
import Accordion from '../Accordion';
import { Text, Stack } from 'vite-storybook';

export const FormEditor = ({ ast, setAST, className }) => {
  const [components, setComponents] = useState([]);
  const [formAST, setFormAST] = useState(ast);

  useEffect(() => {
    setComponents(getComponentAttributes(ast));
  }, [ast]);

  useEffect(() => {
    setComponents(getComponentAttributes(formAST));
  }, [formAST]);

  // debounce how often setAST gets updated
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setAST(formAST);
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [formAST]);

  let handleChange = (e, position) => {
    setFormAST({ ...editTree(ast, e.target.value, position) });
  };

  return (
    <div className={`${s.wrapper} ${className || ''}`}>
      {components.map((component, index) => {
        let { name, props } = component;

        // generate the forms
        // when we edit the input change the ast
        // re render the forms

        return (
          <Accordion title={name} key={index} className={s.form}>
            <Stack gap={0.25} className={s.content}>
              {Object.entries(props).map(([name, prop], index) => (
                <Stack
                  as="label"
                  gap={0.25}
                  htmlFor={name}
                  key={index}
                  className={s.label}
                >
                  <Text size="sm">{name}</Text>
                  <input
                    className={s.input}
                    type={prop.type}
                    name={name}
                    value={prop.value}
                    onChange={(e) => handleChange(e, prop.position)}
                  />
                </Stack>
              ))}
            </Stack>
          </Accordion>
        );
      })}
    </div>
  );
};
