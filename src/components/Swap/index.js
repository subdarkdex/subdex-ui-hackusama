import React, { useContext, useState } from 'react';
import Tabs from '../Tabs';
import TokenInput from '../TokenInput';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import LabelInput from '../LabelInput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import LabelOutput from '../LabelOutput';
import { isValidAddress } from '../../utils/address';

export default function Swap () {
  const { keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const [status, setStatus] = useState('');
  const [fromAsset, setFromAsset] = useState(KSM_ASSET_ID);
  const [fromAssetAmount, setFromAssetAmount] = useState(0);
  const [fromAssetError, setFromAssetError] = useState('');
  const [toAsset, setToAsset] = useState(EDG_ASSET_ID);
  const [toAssetAmount, setToAssetAmount] = useState(0);
  const [toAssetError, setToAssetError] = useState('');
  const [receiver, setReceiver] = useState(account);
  const [receiverError, setReceiverError] = useState('');
  const [price, setPrice] = useState('');
  const [minReceived, setMinReceived] = useState('');
  const validateFromAsset = (amount, assetId) => {
    let amountErrored;
    if (amount && isNaN(amount)) {
      setFromAssetError('invalid amount');
      amountErrored = true;
    } else {
      amountErrored = false;
    }
    let assetErrored;
    if (assetId === toAsset) {
      setFromAssetError('it cannot be the same asset');
      assetErrored = true
    } else {
      assetErrored = false;
    }
    if (!amountErrored && !assetErrored) {
      setFromAssetError('');
    }
  };
  const validateToAsset = (amount, assetId) => {
    let amountErrored;
    if (amount && isNaN(amount)) {
      setToAssetError('invalid amount');
      amountErrored = true;
    } else {
      amountErrored = false;
    }
    let assetErrored;
    if (fromAsset === assetId) {
      setToAssetError('it cannot be the same asset');
      assetErrored = true;
    } else {
      assetErrored = false;
    }
    if (!amountErrored && !assetErrored) {
      setToAssetError('');
    }
  };
  const validateReceiverAddress = (address) => {
    if (address && !isValidAddress(address)) {
      setReceiverError('invalid address');
    } else {
      setReceiverError('');
    }
  };
  const handleChangeFromAssetAmount = (amount) => {
    setFromAssetAmount(amount);
    validateFromAsset(amount, fromAsset);
  };
  const handleChangeFromAsset = (assetId) => {
    setFromAsset(assetId);
    validateFromAsset(fromAssetAmount, assetId);
  };
  const handleChangeToAssetAmount = (amount) => {
    setToAssetAmount(amount);
    validateToAsset(amount, toAsset);
  };
  const handleChangeToAsset = (assetId) => {
    setToAsset(assetId);
    validateToAsset(toAssetAmount, assetId);
  };
  const handleChangeReceiverAddress = (address) => {
    setReceiver(address);
    validateReceiverAddress(address);
  };
  const options = assets.map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));
  return (
    <>
      <Tabs active={'swap'}/>
      <div className='market-place'>
        <TokenInput
          options={options}
          label='From'
          placeholder='0.0'
          error={fromAssetError}
          onChangeAmount={e => handleChangeFromAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => handleChangeFromAsset(assetId)}
          asset={KSM_ASSET_ID}
        />
        <TokenInput
          options={options}
          label='To'
          placeholder='0.0'
          error={toAssetError}
          onChangeAmount={e => handleChangeToAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => handleChangeToAsset(assetId)}
          asset={EDG_ASSET_ID}
          amount={toAssetAmount}
        />
        <div>
          <LabelInput
            label='Receiver'
            placeholder='receiving address'
            value={receiver || ''}
            error={receiverError}
            onChange={e => handleChangeReceiverAddress(e.target.value)}
          />
          <LabelOutput label='Price' value={price}/>
          <LabelOutput label='Min Received' value={minReceived}/>
        </div>
        <TxButton
          accountPair={accountPair}
          disabled={!fromAssetError && !toAssetError}
          attrs={{
            palletRpc: 'dexPalletModule',
            callable: 'ksmToTokenSwap',
            inputParams: [fromAsset, fromAssetAmount, toAsset, toAssetAmount, receiver],
            paramFields: [false, false, false, false, false]
          }}
          setStatus={setStatus}
          type='SIGNED-TX'
          label='Swap'
        />
      </div>
    </>
  );
}
