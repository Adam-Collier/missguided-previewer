import { LivePreview } from 'react-live';
import s from "./preview.module.css";

const Preview = () => {
  return <LivePreview className={s.preview} />;
};

export { Preview };
