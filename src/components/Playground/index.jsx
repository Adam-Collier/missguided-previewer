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
} from 'react-bootstrap';


import { Section } from '../Section';
import { Highlight } from '../Highlight';
// editors
import Editor from '../Editor';
import { MDXEditor } from '../MDXEditor';
// amplience
import { init } from 'dc-extensions-sdk';
import Amplience from '../Amplience';

import s from './playground.module.css';



const Playground = ({ live }) => {
  const [isSDK, setIsSDK] = useState(false);
  const [sdk, setSDK] = useState(undefined);
  // toggle between form and json view

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
          content: previewJSON,
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
