/* eslint react/jsx-key: 0 */
import React, { useEffect, useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { mdx as mdxLib } from '@mdx-js/react';
import * as missguidedComponents from 'missguided-components';
import * as creativeComponents from 'vite-storybook';
import { Container, Row, Col } from 'react-bootstrap';

import { Section } from '../Section';
import { SectionToggle } from '../SectionToggle';
import { Highlight } from '../Highlight';
import { FormEditor } from '../FormEditor';
import { MDXEditor } from '../MDXEditor';
// amplience
import { init } from 'dc-extensions-sdk';
import Amplience from '../Amplience';

import { getComponentAttributes } from '../../lib/component-attributes';
import s from './playground.module.css';

const Playground = ({ live }) => {
  const [isSDK, setIsSDK] = useState(false);
  const [sdk, setSDK] = useState(undefined);
  const [view, setView] = useState('forms');
  // toggle between form and json view

  // update data and layout seperately
  // join together only when sending to amplience
  const [json, setJSON] = useState('{}');
  // const [mdx, setMDX] = useState('');

  // keep our ast data here
  // this acts as our source of truth between the mdx and form
  const [ast, setAST] = useState({});

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
          // let allData = JSON.parse(data);
          // setJSON(allData.data);
          // setMDX(allData.layout);
        });
      })
      .catch((err) => {
        console.log('error sdk', err);
      });
  }, []);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      try {
        setPreviewJSON(JSON.parse(json));
      } catch (e) {
        // if the JSON isn't valid, do nothing
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [json]);

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
          content: previewJSON,
        }}
      >
        <div className={s.wrapper}>
          <section className={s.sidebar}>
            <Amplience
              isSDK={isSDK}
              sdk={sdk}
              json={json}
              mdx={previewMDX}
              setJSON={setJSON}
              setMDX={setPreviewMDX}
            />
            <SectionToggle view={view} setView={setView} />
            {/* hide or show the editor or forms via a class (this way we maintain state throughout) */}
            <FormEditor
              className={view === 'forms' ? "" : s.hidden}
              ast={ast}
              setAST={setAST}
              components={getComponentAttributes(ast)}
            />
            <div
              className={`${s.mdxEditor} ${view === 'editor' ? "" : s.hidden}`}
            >
              <MDXEditor
                ast={ast}
                setPreviewMDX={setPreviewMDX}
                setAST={setAST}
                className={s.mdx}
              />
              <Section text="error">
                <LiveError className={s.error} />
              </Section>
            </div>
          </section>
          <LivePreview className={s.preview} />
        </div>
      </LiveProvider>
    );
  }

  return <Highlight code={previewMDX} />;
};

export { Playground };
