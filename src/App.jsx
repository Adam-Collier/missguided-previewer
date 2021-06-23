import React from "react";
import { baseStyles } from 'unified-ui';
import {globalStyles} from "./styles/global";
import { Playground } from './components/Playground';
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Style = ({ children }) => (
  <style
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
);

const App = () => {
  return (
    <div className="App">
        <Style>{baseStyles}</Style>
        <Style>{globalStyles}</Style>
        <Playground live="true" className="" children="" />
    </div>
  );
};

export { App };
