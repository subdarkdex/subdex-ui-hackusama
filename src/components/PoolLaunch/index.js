import React, { useState, useContext, useEffect } from 'react';
import Hint from '../Hint';
import assets, { assetMap, EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import TokenInput from '../TokenInput';
import LabelOutput from '../LabelOutput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import { convertAmount } from '../../utils/conversion';

export default function PoolLaunch () {
  const { api, keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Cannot find the pool? Add the desirable token pair and become its first liquidity provider';
  const [hint, setHint] = useState(defaultHint);
  const [status, setStatus] = useState('');
  const [ksmAmount, setKsmAmount] = useState(null);
  const [ksmAssetError, setKsmAssetError] = useState('');
  const [asset, setAsset] = useState(EDG_ASSET_ID);
  const [assetAmount, setAssetAmount] = useState(null);
  const [assetError, setAssetError] = useState('');
  const [priceInfo, setPriceInfo] = useState('');
  const [exchangeExists, setExchangeExists] = useState(false);

  useEffect(() => {
    if (assetError || ksmAssetError) {
      setPriceInfo('');
    } else {
      if (ksmAmount && assetAmount) {
        setPriceInfo(`${getPrice(ksmAmount, assetAmount)} ${assetMap.get(asset).symbol} / KSM`);
      }
    }
  }, [ksmAmount, asset, assetAmount, ksmAssetError]);

  useEffect(() => {
    setHint(status);
  }, [status]);

  useEffect(() => {
    let unsubscribe;
    api.query.dexPallet.exchanges(asset, (exchange) => {
      console.log('invariant', exchange.get('invariant').toString());
      if (exchange.get('invariant').toString() !== '0') {
        setExchangeExists(true);
        setHint(`There is already liquidity for ${assetMap.get(asset).symbol} now, please click Invest button to add more liquidity`);
      } else {
        setExchangeExists(false);
        setHint(defaultHint);
      }
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);
    return () => unsubscribe && unsubscribe();
  }, [asset]);

  const getPrice = (ksmAmount, assetAmount) => {
    return (Number.parseFloat(assetAmount) / Number.parseFloat(ksmAmount)).toFixed(6);
  };

  const validateKsmAsset = (amount) => {
    if (amount && (isNaN(amount) || Number.parseFloat(amount) <= 0)) {
      setKsmAssetError('invalid amount');
    } else {
      setKsmAssetError('');
    }
  };

  const validateAsset = (amount) => {
    if (amount && (isNaN(amount) || Number.parseFloat(amount) <= 0)) {
      setAssetError('invalid amount');
    } else {
      setAssetError('');
    }
  };

  const handleChangeKsmAmount = (amount) => {
    setKsmAmount(amount);
    validateKsmAsset(amount);
  };

  const handleChangeAssetAmount = (amount) => {
    setAssetAmount(amount);
    validateAsset(amount, asset);
  };

  const handleChangeAsset = (assetId) => {
    setAsset(assetId);
    setStatus('');
    validateAsset(assetAmount, assetId);
  };

  const ksmAssetOptions = assets.filter(asset => asset.assetId === KSM_ASSET_ID).map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));

  const assetOptions = assets.filter(asset => asset.assetId !== KSM_ASSET_ID).map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));

  const inProgress = () => {
    return !!status && !status.startsWith('Finalized') && !status.startsWith('Error');
  };

  return (
    <div className='pool-inputs-container'>
      <Hint text={hint}/>
      <TokenInput
        options={ksmAssetOptions}
        label='Deposit'
        placeholder='0.0'
        error={ksmAssetError}
        onChangeAmount={e => handleChangeKsmAmount(e.target.value)}
        asset={KSM_ASSET_ID}
        amount={ksmAmount}
      />
      <div>
        <TokenInput
          options={assetOptions}
          label='Deposit'
          placeholder='0.0'
          error={assetError}
          onChangeAmount={e => handleChangeAssetAmount(e.target.value)}
          onChangeAsset={(assetId) => handleChangeAsset(assetId)}
          asset={asset}
          amount={assetAmount}
        />
        <LabelOutput label='Initial price' value={priceInfo}/>
        <LabelOutput label='Your shares' value='100%'/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={ksmAssetError || assetError || exchangeExists || inProgress()}
        attrs={{
          palletRpc: 'dexPallet',
          callable: 'initializeExchange',
          inputParams: [convertAmount(KSM_ASSET_ID, ksmAmount), asset, convertAmount(asset, assetAmount)],
          paramFields: [false, false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Launch'
      />
    </div>
  );
}
