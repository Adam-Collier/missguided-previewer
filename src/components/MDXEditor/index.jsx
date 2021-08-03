import { useEffect, useState } from 'react';
import { LiveEditor } from 'react-live';
import { generateTree } from '../../lib/generate-tree';

import { prettyPrint } from 'recast';

export const MDXEditor = ({
  ast,
  setPreviewMDX,
  className,
  setAST,
}) => {
  const [mdx, setMDX] = useState("");
  const [mdxAST, setMDXAST] = useState({});

  // whenever the AST gets updated run this
  useEffect(() => {
    if(mdxAST !== ast){
      if (ast !== undefined && Object.keys(ast).length > 0) {
        setMDX(prettyPrint(ast, { tabWidth: 2 }).code.slice(0, -1));
      }
    }
  }, [ast, setMDX]);

  // debounce how ofter setPreviewMDX gets updated
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setPreviewMDX(mdx);
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [mdx, setPreviewMDX]);

  // debounce how often setAST gets updated
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setAST(mdxAST);
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [mdxAST]);

  const handleChange = (e) => {
    setMDX(e);
    setMDXAST(generateTree(e));
  };

  return <LiveEditor className={className} onChange={handleChange} />;
};
