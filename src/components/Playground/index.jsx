/* eslint react/jsx-key: 0 */
import React, { useEffect, useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { mdx as mdxLib } from '@mdx-js/react';
import * as missguidedComponents from 'missguided-components';
import * as creativeComponents from 'vite-storybook';
import {
  Container,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';


import { Section } from '../Section';
import { Highlight } from '../Highlight';
// // form
import { ComponentForm } from '../ComponentForm';
import ComponentLibraryDescription from 'missguided-components/dist/form/information.json';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
// editors
import Editor from '../Editor';
import { MDXEditor } from '../MDXEditor';
// amplience
import { init } from 'dc-extensions-sdk';
import Amplience from '../Amplience';

import s from './playground.module.css';

const contentChangeDebounce = new Subject();
const valueUpdate = new Subject();

contentChangeDebounce
  .pipe(debounceTime(1000))
  .subscribe(({ changedLayout, contentData, callback }) => {
    Object.keys(ComponentLibraryDescription).forEach((componentKey) => {
      let modifier = 0;
      const pattern = `<${componentKey} (.*?)\/>`;
      Array.from(changedLayout.matchAll(new RegExp(pattern, 'gi'))).forEach(
        (item, index) => {
          if (item[1].indexOf('{ ...content.') === -1) {
            const inserString = ` { ...content.${componentKey + index}} `;

            changedLayout = `${changedLayout.substring(
              0,
              item.index + modifier
            )} <${componentKey}${inserString}${changedLayout.substring(
              item.index + modifier + componentKey.length + 2
            )}`;

            modifier = modifier + inserString.length;
            contentData[componentKey + index] = { componentType: componentKey };
            Object.keys(ComponentLibraryDescription[componentKey]).forEach(
              (propertyKey) => {
                contentData[componentKey + index][propertyKey] = '';
              }
            );
          }
        }
      );
    });

    Object.keys(contentData).forEach((contentKey) => {
      if (changedLayout.indexOf(contentKey) === -1) {
        delete contentData[contentKey];
      }
    });

    callback(changedLayout, contentData);
  });

valueUpdate
  .pipe(debounceTime(500))
  .subscribe(
    ({ content, setContent, componentName, descriptionKey, value }) => {
      console.log(content);
      content.data[componentName][descriptionKey] = value;
      setContent({ ...content });
    }
  );



const Playground = ({ live }) => {
  const [isSDK, setIsSDK] = useState(false);
  const [sdk, setSDK] = useState(undefined);
  // toggle between form and json view
  const [advancedMode, setAdvancedMode] = useState(false);

  // update data and layout seperately
  // join together only when sending to amplience
  const [json, setJSON] = useState('{}');
  const [mdx, setMDX] = useState('');

  const [previewMDX, setPreviewMDX] = useState('');
  const [previewJSON, setPreviewJSON] = useState('');

  useEffect(() => {
    init()
      .then((sdk) => {
        // output available locales
        setIsSDK(true);
        console.log('sdk thingy', sdk);
        sdk.frame.setHeight(1200);
        setSDK(sdk);
        sdk.field.getValue().then((data) => {
          console.log('field data:', data, typeof data);
          // setContent(JSON.parse(data));
          let allData = JSON.parse(data);
          setJSON(allData.data);
          setMDX(allData.layout);
        });
      })
      .catch((err) => {
        console.log('error sdk', err);
      });
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setPreviewJSON(json);
      console.log('json been set');
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [json]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setPreviewMDX(mdx);
      console.log('mdx been set');
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [mdx]);

  // TODO: figure out a way to handle sdk logic
  // could pass as initial values and update state in useEffect

  // const handleJSON = (e) => {
  //   setJSON(e);

  //   if (isSDK) {
  //     sdk.field.setValue(JSON.stringify({ data, layout }));
  //   }
  // };

  const handleAdvancedModeChange = (value) => {
    setAdvancedMode(value);
  };


  console.log(missguidedComponents, "missguided components");
  console.log(creativeComponents["Text"].propTypes);


  if (live) {
    return (
      <LiveProvider
        code={previewMDX}
        transformCode={(code) => '/** @jsx mdx */' + code}
        scope={{
          mdx: mdxLib,
          ...missguidedComponents,
          ...creativeComponents,
          Container,
          Col,
          Row,
          content: json,
        }}
      >
        <div className={s.wrapper}>
          <section className={s.sidebar}>
            <Section>
              <Amplience
                isSDK={isSDK}
                sdk={sdk}
                json={json}
                mdx={mdx}
                setJSON={setJSON}
                setMDX={setMDX}
              />
            </Section>
            {/* <Section>
              <ToggleButtonGroup
                type="radio"
                value={advancedMode}
                name="advancedMode"
                onChange={handleAdvancedModeChange}
                className="mb-4"
              >
                <ToggleButton name="form" value={true}>
                  Form
                </ToggleButton>
                <ToggleButton name="json" value={false}>
                  Json
                </ToggleButton>
              </ToggleButtonGroup>
            </Section>
            {advancedMode ? (
              <ComponentForm
                valueUpdate={valueUpdate}
                content={{ data: { ...json } }}
                setContent={setJSON}
              />
            ) : (
              <Editor json={json} setJSON={setJSON} className={s.json} />
            )} */}
            <Section text="json">
              <Editor json={json} setJSON={setJSON} className={s.json} />
            </Section>
            <Section text="mdx">
              <MDXEditor setMDX={setMDX} className={s.mdx} />
            </Section>
            <Section text="error">
              <LiveError className={s.error} />
            </Section>
          </section>
          <LivePreview className={s.preview} />
        </div>
      </LiveProvider>
    );
  }

  return <Highlight code={mdx} />;
};

export { Playground };
