import { useState, useEffect } from 'react';
import { LivePreview } from 'react-live';
import s from "./preview.module.css";

const Preview = ({ json, mdx }) => {
  const [previewMDX, setPreviewMDX] = useState('');
  const [previewJSON, setPreviewJSON] = useState('');

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

  return <LivePreview className={s.preview} />;
};

export { Preview };
