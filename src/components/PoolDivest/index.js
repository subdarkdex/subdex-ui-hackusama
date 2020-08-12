import React, { useState, useContext, useEffect } from 'react';
import Hint from '../Hint';
import TokenInput from '../TokenInput';
import assets, { assetMap, EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import LabelInput from '../LabelInput';
import LabelOutput from '../LabelOutput';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import { TxButton } from '../TxButton';
import { convertBalance, shortenNumber } from '../../utils/conversion';
import BigNumber from 'bignumber.js';

export default function PoolInvest () {
  const { api, keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Divest your tokens from the liquidity pool by burning your DarkDEX shares';
  const [status, setStatus] = useState('');
  const [currentAssetShares, setCurrentAssetShares] = useState(0);
  const [hint, setHint] = useState(defaultHint);
  const [divestAsset, setDivestAsset] = useState(EDG_ASSET_ID);
  const [divestAssetError, setDivestAssetError] = useState('');
  const [ksmPool, setKsmPool] = useState();
  const [tokenPool, setTokenPool] = useState();
  const [divestInfo, setDivestInfo] = useState('');
  const [sharesToDivest, setSharesToDivest] = useState('');
  const [totalShares, setTotalShares] = useState(0);
  const [poolInfo, setPoolInfo] = useState('');
  const [sharesInfo, setSharesInfo] = useState('');
  const [ksmToReceive, setKsmToReceive] = useState('');
  const [assetToReceive, setAssetToReceive] = useState('');

  useEffect(() => {
    let unsubscribe;
    api.query.dexPallet.exchanges(divestAsset, (exchange) => {
      if (exchange.get('invariant').toString() === '0') {
        setHint(`There is no exchange for ${assetMap.get(divestAsset).symbol}, you probably can click Launch button to start the new exchange`);
        setPoolInfo('');
        setSharesInfo('');
        setTotalShares(0);
        setCurrentAssetShares(0);
      } else {
        setHint(defaultHint);
        const ksmPoolStr = exchange.get('ksm_pool').toString();
        const ksmPoolBalance = shortenNumber(convertBalance(KSM_ASSET_ID, ksmPoolStr).toString());
        setKsmPool(ksmPoolStr);
        const tokenPoolStr = exchange.get('token_pool').toString();
        const tokenPoolBalance = shortenNumber(convertBalance(divestAsset, tokenPoolStr).toString());
        setTokenPool(tokenPoolStr);
        setPoolInfo(`${ksmPoolBalance} KSM + ${tokenPoolBalance} ${assetMap.get(divestAsset).symbol}`);
        const totalSharesNumber = exchange.get('total_shares').toNumber();
        setTotalShares(totalSharesNumber);
        const sharesInfo = JSON.parse(exchange.get('shares').toString());
        setCurrentAssetShares(sharesInfo[account] || 0);
        setSharesInfo(sharesInfo[account] ? `${sharesInfo[account] * 100 / totalSharesNumber} %` : '0');
      }
    }).then(unsub => {
      unsubscribe = unsub;
    }).catch(console.error);
    return () => unsubscribe && unsubscribe();
  }, [divestAsset, account]);

  useEffect(() => {
    if (!divestAssetError && sharesToDivest && ksmPool && totalShares) {
      const ksmToReceive = new BigNumber(ksmPool).multipliedBy(sharesToDivest).div(totalShares);
      setKsmToReceive(ksmToReceive.toString());
      const assetToReceive = new BigNumber(tokenPool).multipliedBy(sharesToDivest).div(totalShares);
      setAssetToReceive(assetToReceive.toString());
      setDivestInfo(`${convertBalance(KSM_ASSET_ID, ksmToReceive)} KSM + ${convertBalance(divestAsset, assetToReceive)} ${assetMap.get(divestAsset).symbol}`);
    } else {
      setKsmToReceive(undefined);
      setAssetToReceive(undefined);
      setDivestInfo('');
    }
  }, [divestAsset, sharesToDivest]);

  useEffect(() => {
    setHint(status);
    if (status && status.includes('InBlock')) {
      setSharesToDivest('');
    }
  }, [status]);

  const validateSharesToDivest = (amount) => {
    if (amount && isNaN(amount)) {
      setDivestAssetError('invalid amount');
    } else if (Number.parseFloat(amount) > currentAssetShares) {
      setDivestAssetError('not enough shares');
    } else {
      setDivestAssetError('');
    }
  };

  const handleChangeSharesToDivest = (amount) => {
    setSharesToDivest(amount);
    validateSharesToDivest(amount, divestAsset);
  };

  const divestAssetOptions = assets.filter(asset => asset.assetId !== KSM_ASSET_ID).map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));

  return (
    <div className='pool-inputs-container'>
      <Hint text={hint}/>
      <TokenInput
        options={divestAssetOptions}
        label={'Shares (' + currentAssetShares + ')'}
        placeholder='0.0'
        error={divestAssetError}
        onChangeAmount={e => handleChangeSharesToDivest(e.target.value)}
        onChangeAsset={setDivestAsset}
        asset={divestAsset}
        amount={sharesToDivest}
      />
      <div>
        <LabelInput
          label='Output (estimated)'
          placeholder="assets you'll receive from the pool"
          value={divestInfo || ''}
          readOnly={true}
        />
        <LabelOutput label='Current pool' value={poolInfo}/>
        <LabelOutput label='Your shares' value={sharesInfo}/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={divestAssetError}
        attrs={{
          palletRpc: 'dexPallet',
          callable: 'divestLiquidity',
          inputParams: [divestAsset, sharesToDivest, ksmToReceive, assetToReceive],
          paramFields: [false, false, false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Divest'
      />
    </div>
  );
}
