/* eslint react/jsx-key: 0 */
import React, { useEffect, useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';
import { mdx } from '@mdx-js/react';
import * as missguidedComponents from 'missguided-components';
import * as creativeComponents from 'vite-storybook';
import { Container, Row, Col } from 'react-bootstrap';

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

  // update data and layout seperately
  // join together only when sending to amplience
  const [data, setData] = useState('{}');
  const [layout, setLayout] = useState('');

  const [previewLayout, setPreviewLayout] = useState('');
  const [previewData, setPreviewData] = useState('');

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
          setData(allData.data);
          setLayout(allData.layout);
        });
      })
      .catch((err) => {
        console.log('error sdk', err);
      });
  }, []);

  // TODO: figure out a way to handle sdk logic
  // could pass as initial values and update state in useEffect

  // const handleJSON = (e) => {
  //   setData(e);

  //   if (isSDK) {
  //     sdk.field.setValue(JSON.stringify({ data, layout }));
  //   }
  // };

  if (live) {
    return (
      <LiveProvider
        code={previewLayout}
        transformCode={(code) => '/** @jsx mdx */' + code}
        scope={{
          mdx,
          ...missguidedComponents,
          ...creativeComponents,
          Container,
          Col,
          Row,
          content: previewData,
        }}
      >
        <div className={s.wrapper}>
          <section className={s.sidebar}>
            <Section>
              <Amplience
                isSDK={isSDK}
                sdk={sdk}
                data={data}
                layout={layout}
                setData={setData}
                setLayout={setLayout}
              />
            </Section>
            <Section text="json">
              <Editor setPreviewData={setPreviewData} className={s.json} />
            </Section>
            <Section text="mdx">
              <MDXEditor
                setPreviewLayout={setPreviewLayout}
                className={s.mdx}
              />
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

  return <Highlight code={layout} />;
};

export { Playground };
