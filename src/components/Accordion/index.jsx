/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { Plus, Minus } from 'react-feather';
import s from './accordion.module.css';

const Accordion = ({ children, title, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? Minus : Plus;

  return (
    <div className={className ? className : ''}>
      <button
        className={s.accordion}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon size={12} />
        <p>{title}</p>
      </button>
      {isOpen && children}
    </div>
  );
};

export default Accordion;
