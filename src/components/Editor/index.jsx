import {useState, useEffect} from "react";
import CodeEditor from 'react-simple-code-editor';
import Highlight, { Prism } from 'prism-react-renderer';
import theme from './theme';

const Editor = ({ language = 'yaml', className, setPreviewData }) => {
  const [data, setData] = useState("{}");

  const handleChange = (e) => {
    setData(e);
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setPreviewData(data);
      console.log('data been set');
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [data]);

  let highlightCode = (code) => (
    <Highlight Prism={Prism} code={code} theme={theme} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );

  return (
    <CodeEditor
      className={className}
      value={data}
      padding={10}
      highlight={highlightCode}
      onValueChange={handleChange}
    />
  );
};

export default Editor;
