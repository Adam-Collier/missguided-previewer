import s from './section-title.module.css';

export const Section = ({ text, children }) => (
  <section className={s.section}>
    {text && <p className={s.text}>{text}</p>}
    <div className={s.content}>{children}</div>
  </section>
);
