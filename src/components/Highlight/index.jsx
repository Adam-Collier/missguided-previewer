import Highlighter, { defaultProps } from 'prism-react-renderer';

export const Highlight = ({code}) => {
  return (
    <Highlighter {...defaultProps} code={code}>
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
    </Highlighter>
  );
};
