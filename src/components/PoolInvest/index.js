import React, { useState, useContext } from 'react';
import Hint from '../Hint';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import TokenInput from '../TokenInput';
import LabelOutput from '../LabelOutput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import './pool-invest.css';

export default function PoolInvest () {
  const { keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Invest your tokens to the liquidity pool and earn 3% of the trading fees';
  const [status, setStatus] = useState('');
  const [hint, setHint] = useState(defaultHint);
  const [fromAsset, setFromAsset] = useState(KSM_ASSET_ID);
  const [ksmAmount, setKsmAmount] = useState(0);
  const [ksmAssetError, setKsmAssetError] = useState('');
  const [toAsset, setToAsset] = useState(EDG_ASSET_ID);
  const [toAssetAmount, setToAssetAmount] = useState(0);
  const [toAssetError, setToAssetError] = useState('');
  const [poolInfo, setPoolInfo] = useState('');
  const [sharesInfo, setSharesInfo] = useState('');
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
    <div className='pool-invest-container'>
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
          asset={EDG_ASSET_ID}
          amount={toAssetAmount}
        />
        <LabelOutput label='Current pool' value={poolInfo}/>
        <LabelOutput label='Your shares' value={sharesInfo}/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={!ksmAssetError && !toAssetError}
        attrs={{
          palletRpc: 'dexPalletModule',
          callable: 'invest',
          inputParams: [ksmAmount, toAsset, toAssetAmount],
          paramFields: [false, false, false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Invest'
      />
    </div>
  );
}
