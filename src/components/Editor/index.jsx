import CodeEditor from 'react-simple-code-editor';
import Highlight, { Prism } from 'prism-react-renderer';
import theme from './theme';

const Editor = ({ handleChange, code, language = 'yaml', className }) => {
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
      value={code}
      padding={10}
      highlight={highlightCode}
      onValueChange={handleChange}
    />
  );
};

export default Editor;
