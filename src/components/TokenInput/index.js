import React, { useState, useContext } from 'react';
import './token-input.css';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import BalanceAnnotation from '../BalanceAnnotation';
import { AccountContext } from '../../context/AccountContext';

function TokenInput (props) {
  const { account } = useContext(AccountContext);
  const { label, options, error, ...rest } = props;
  const [assetId, setAssetId] = useState(options[0].value);
  const onChangeAsset = assetId => {
    setAssetId(assetId);
  };
  return (
    <div className="token-input-container">
      <div className="label-error-balance">
        <div>{label || ''}</div>
        <div className={error ? 'token-input-error' : 'token-input-no-error'}>{error}</div>
        <div>
          <BalanceAnnotation address={account} assetId={assetId} label="Balance: "/>
        </div>
      </div>
      <div className="input-and-dropdown">
        <input {...rest}/>
        <Dropdown fluid search selection
          options={options}
          onChange={(_, dropdown) => {
            onChangeAsset(dropdown.value);
          }}
          value={assetId}
        />
      </div>
    </div>
  );
}

TokenInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default TokenInput;
