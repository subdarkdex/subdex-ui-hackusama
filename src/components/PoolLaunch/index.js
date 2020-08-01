import React, { useState, useContext } from 'react';
import Hint from '../Hint';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import TokenInput from '../TokenInput';
import LabelOutput from '../LabelOutput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import './pool-launch.css';

export default function PoolLaunch () {
  const { keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Cannot find the pool? Add the desirable token pair and become its first liquidity provider';
  const [status, setStatus] = useState('');
  const [hint, setHint] = useState(defaultHint);
  const [ksmAmount, setKsmAmount] = useState(0);
  const [ksmAssetError, setKsmAssetError] = useState('');
  const [toAsset, setToAsset] = useState(EDG_ASSET_ID);
  const [toAssetAmount, setToAssetAmount] = useState(0);
  const [toAssetError, setToAssetError] = useState('');
  const [priceInfo, setPriceInfo] = useState('');
  const validateKsmAsset = (amount) => {
    if (amount && isNaN(amount)) {
      setKsmAssetError('invalid amount');
    } else {
      setKsmAssetError('');
    }
  };
  const validateToAsset = (amount) => {
    if (amount && isNaN(amount)) {
      setToAssetError('invalid amount');
    } else {
      setToAssetError('');
    }
  };
  const handleChangeKsmAmount = (amount) => {
    setKsmAmount(amount);
    validateKsmAsset(amount);
  };
  const handleChangeToAssetAmount = (amount) => {
    setToAssetAmount(amount);
    validateToAsset(amount, toAsset);
  };
  const handleChangeToAsset = (assetId) => {
    setToAsset(assetId);
    validateToAsset(toAssetAmount, assetId);
  };
  const fromAssetOptions = assets.filter(asset => asset.assetId === KSM_ASSET_ID).map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));
  const toAssetOptions = assets.filter(asset => asset.assetId !== KSM_ASSET_ID).map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));
  return (
    <div className='pool-launch-container'>
      <Hint text={hint}/>
      <TokenInput
        options={fromAssetOptions}
        label='Deposit'
        placeholder='0.0'
        error={ksmAssetError}
        onChangeAmount={e => handleChangeKsmAmount(e.target.value)}
        asset={KSM_ASSET_ID}
      />
      <div>
        <TokenInput
          options={toAssetOptions}
          label='Deposit'
          placeholder='0.0'
          error={toAssetError}
          onChangeAmount={e => handleChangeToAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => handleChangeToAsset(assetId)}
          asset={toAsset}
          amount={toAssetAmount}
        />
        <LabelOutput label='Initial price' value={priceInfo}/>
        <LabelOutput label='Your shares' value='100%'/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={!ksmAssetError && !toAssetError}
        attrs={{
          palletRpc: 'dexPalletModule',
          callable: 'initializeNew',
          inputParams: [ksmAmount, toAsset, toAssetAmount],
          paramFields: [false, false, false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Launch'
      />
    </div>
  );
}
