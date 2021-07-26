import { useEffect } from 'react';
import { LiveEditor } from 'react-live';
import { generateTree } from '../../lib/generate-tree';
import { prettyPrint } from 'recast';

export const MDXEditor = ({ ast, setMDX, setAST, className }) => {
  useEffect(() => {
    if (ast === undefined || Object.keys(ast).length > 0) {
      setMDX(prettyPrint(ast, { tabWidth: 2 }).code.slice(0, -1));
    }
  }, [ast, setMDX]);

  const handleChange = (e) => {
    setMDX(e);
    let ast = generateTree(e);
    setAST(ast);
  };

  return <LiveEditor className={className} onChange={handleChange} />;
};
