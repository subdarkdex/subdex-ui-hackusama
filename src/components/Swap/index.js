import React, { useContext, useState } from 'react';
import Tabs from '../Tabs';
import TokenInput from '../TokenInput';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import LabelInput from '../LabelInput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';

export default function Swap () {
  const { keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const [status, setStatus] = useState('');
  const [fromAsset, setFromAsset] = useState(KSM_ASSET_ID);
  const [fromAssetAmount, setFromAssetAmount] = useState(0);
  const [toAsset, setToAsset] = useState(EDG_ASSET_ID);
  const [toAssetAmount, setToAssetAmount] = useState(0);
  const [receiver, setReceiver] = useState(account);
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
          onChangeAmount={(e) => setFromAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => setFromAsset(assetId)}
          asset={KSM_ASSET_ID}
        />
        <TokenInput
          options={options}
          label='To'
          placeholder='0.0'
          onChangeAmount={(e) => setToAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => setToAsset(assetId)}
          asset={EDG_ASSET_ID}
          amount={toAssetAmount}
        />
        <LabelInput
          label='Receiver'
          placeholder='receiving address'
          value={receiver}
          onChange={e => setReceiver(e.target.value)}
        />
        <TxButton
          accountPair={accountPair}
          attrs={{
            palletRpc: 'dexPalletModule',
            callable: 'ksmToTokenSwap',
            inputParams: [fromAsset, fromAssetAmount, toAsset, toAssetAmount, receiver],
            paramFields: [true]
          }}
          setStatus={setStatus}
          type='SIGNED-TX'
          label='Swap'
        />
      </div>
    </>
  );
}
