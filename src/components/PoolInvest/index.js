import React, { useState, useContext, useEffect } from 'react';
import Hint from '../Hint';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID, assetMap } from '../../assets';
import TokenInput from '../TokenInput';
import LabelOutput from '../LabelOutput';
import { TxButton } from '../TxButton';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import { convertBalance } from '../../utils/conversion';

export default function PoolInvest () {
  const { api, keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Invest your tokens to the liquidity pool and earn 3% of the trading fees';
  const [status, setStatus] = useState('');
  const [hint, setHint] = useState(defaultHint);
  const [ksmAmount, setKsmAmount] = useState('');
  const [ksmAssetError, setKsmAssetError] = useState('');
  const [asset, setAsset] = useState(EDG_ASSET_ID);
  const [assetAmount, setAssetAmount] = useState('');
  const [assetError, setAssetError] = useState('');
  const [ksmPool, setKsmPool] = useState();
  const [tokenPool, setTokenPool] = useState();
  const [poolInfo, setPoolInfo] = useState('');
  const [totalShares, setTotalShares] = useState(0);
  const [shares, setShares] = useState(0);
  const [sharesInfo, setSharesInfo] = useState('');
  const [exchangeExists, setExchangeExists] = useState(false);

  useEffect(() => {
    let unsubscribe;
    api.query.dexPallet.exchanges(asset, (exchange) => {
      if (exchange.get('invariant').toString() === '0') {
        setExchangeExists(false);
        setHint(`You are the first liquidity provider for ${assetMap.get(asset).symbol}, please click Launch button to start the new exchange`);
        setPoolInfo('');
        setSharesInfo('');
        setTotalShares(0);
        setShares(0);
      } else {
        setExchangeExists(true);
        setHint(defaultHint);
        const convertedKsmPool = convertBalance(KSM_ASSET_ID, exchange.get('ksm_pool').toString());
        setKsmPool(convertedKsmPool);
        let convertedTokenPool = convertBalance(asset, exchange.get('token_pool').toString());
        setTokenPool(convertedTokenPool);
        setPoolInfo(`${convertedKsmPool} KSM + ${convertedTokenPool} ${assetMap.get(asset).symbol}`);
        setTotalShares(exchange.get('total_shares').toNumber());
        const sharesInfo = exchange.get('shares').get(account);
        setSharesInfo(sharesInfo);
      }
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);
    return () => unsubscribe && unsubscribe();
  }, [asset]);

  useEffect(() => {
    setHint(status);
    if (status && status.includes('InBlock')) {
      setAssetAmount('');
    }
  }, [status]);

  useEffect(() => {
    if (!ksmAssetError && ksmAmount && ksmPool && tokenPool && totalShares) {
      setAssetAmount((ksmAmount * tokenPool.toNumber() / ksmPool.toNumber()).toString());
      setShares(ksmAmount * totalShares / ksmPool.toNumber());
    } else {
      setAssetAmount('');
      setShares(0);
    }
  }, [ksmAssetError, ksmAmount]);

  useEffect(() => {
    if (!assetError && assetAmount && ksmPool && tokenPool && totalShares) {
      setKsmAmount((assetAmount * ksmPool.toNumber() / tokenPool.toNumber()).toString());
      setShares(assetAmount * totalShares / tokenPool.toNumber());
    } else {
      setKsmAmount('');
      setShares(0);
    }
  }, [assetError, assetAmount]);

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

  const inProgress = () => {
    return !!status && !status.startsWith('Finalized') && !status.startsWith('Error');
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
          onChangeAsset={setAsset}
          asset={asset}
          amount={assetAmount}
        />
        <LabelOutput label='Current pool' value={poolInfo}/>
        <LabelOutput label='Your shares' value={sharesInfo}/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={!!ksmAssetError || !!assetError || !exchangeExists || inProgress() || !shares}
        attrs={{
          palletRpc: 'dexPallet',
          callable: 'investLiquidity',
          inputParams: [asset, shares],
          paramFields: [false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Invest'
      />
    </div>
  );
}
