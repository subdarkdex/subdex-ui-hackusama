import React from 'react';
import './label-input.css';
import PropTypes from 'prop-types';

function LabelInput (props) {
  const { label, hasError, errorMessage, ...rest } = props;
  return (
    <div className="label-input-container">
      <div className="label-and-error">
        <div className="label-input-label">{label || ''}</div>
        <div className={hasError ? 'label-input-error' : 'label-input-no-error'}>{errorMessage}</div>
      </div>
      <input {...rest}/>
    </div>
  );
}

LabelInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default LabelInput;
