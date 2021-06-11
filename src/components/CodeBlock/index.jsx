/* eslint react/jsx-key: 0 */

import React, { useEffect, useState } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { mdx } from '@mdx-js/react';
import * as missguidedComponents from 'missguided-components';
import { Container, Row, Col } from 'react-bootstrap';
// json editor
import Editor from '../Editor';
import { init } from 'dc-extensions-sdk';
import Amplience from '../Amplience';

import './CodeBlock.css';

const CodeBlock = ({ live }) => {
  const [isSDK, setIsSDK] = useState(false);
  const [sdk, setSDK] = useState(undefined);

  // update data and layout seperately
  // join together only when sending to amplience
  const [data, setData] = useState('{}');
  const [layout, setLayout] = useState('');

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

  const handleJSON = (e) => {
    console.log(e);
    setData(e);

    if (isSDK) {
      sdk.field.setValue(JSON.stringify({ data, layout }));
    }
  };

  const onLayoutChange = (event) => {
    console.log('on layout change:', event);
    setLayout(event);
  };

  if (live) {
    return (
      <LiveProvider
        code={layout}
        transformCode={(code) => '/** @jsx mdx */' + code}
        scope={{
          mdx,
          ...missguidedComponents,
          Container,
          Col,
          Row,
          content: data,
        }}
      >
        <div className="wrapper">
          <section className="sidebar">
            <Amplience
              isSDK={isSDK}
              sdk={sdk}
              data={data}
              layout={layout}
              setData={setData}
              setLayout={setLayout}
            />
            <Editor
              code={data}
              handleChange={handleJSON}
              className="json-editor"
            />
            <LiveEditor className="live-editor" onChange={onLayoutChange} />
            <LiveError className="live-error" />
          </section>
          <LivePreview className="live-preview" />
        </div>
      </LiveProvider>
    );
  }

  return (
    <Highlight {...defaultProps} code={layout}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '20px' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export { CodeBlock };
