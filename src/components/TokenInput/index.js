import React, { useState, useContext } from 'react';
import './token-input.css';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import BalanceAnnotation from '../BalanceAnnotation';
import { AccountContext } from '../../context/AccountContext';
import { assetMap } from '../../assets';

function TokenInput (props) {
  const { account } = useContext(AccountContext);
  const { label, asset, options, error, onChangeAsset, onChangeAmount, ...rest } = props;
  const [assetId, setAssetId] = useState(asset);
  const handleChangeAsset = assetId => {
    setAssetId(assetId);
    onChangeAsset && onChangeAsset(assetId);
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
        <input onChange={onChangeAmount} {...rest}/>
        <img src={assetMap.get(assetId).logo} alt="" width={22}/>
        <Dropdown fluid search selection
          options={options}
          onChange={(_, dropdown) => {
            handleChangeAsset(dropdown.value);
          }}
          value={assetId}
        />
      </div>
    </div>
  );
}

TokenInput.propTypes = {
  label: PropTypes.string,
  asset: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
  onChangeAsset: PropTypes.func,
  onChangeAmount: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default TokenInput;
