import React from 'react';
import './hint.css';

export default function Hint (props) {
  return (
    <div className="hint">
      <div>&#9432;</div>
      <div className="hint-text">{props.text}</div>
    </div>
  );
}
