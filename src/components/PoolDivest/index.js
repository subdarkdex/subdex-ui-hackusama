import React, { useState, useContext } from 'react';
import Hint from '../Hint';
import TokenInput from '../TokenInput';
import assets, { EDG_ASSET_ID, KSM_ASSET_ID } from '../../assets';
import LabelInput from '../LabelInput';
import LabelOutput from '../LabelOutput';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext';
import { TxButton } from '../TxButton';

export default function PoolInvest () {
  const { keyring } = useSubstrate();
  const { account } = useContext(AccountContext);
  const accountPair = account && keyring.getPair(account);
  const defaultHint = 'Divest your tokens from the liquidity pool by burning your DarkDEX shares';
  const [status, setStatus] = useState('');
  const [currentAssetShares, setCurrentAssetShares] = useState(100); // TODO query API
  const [hint, setHint] = useState(defaultHint);
  const [divestAsset, setDivestAsset] = useState(EDG_ASSET_ID);
  const [divestAssetError, setDivestAssetError] = useState('');
  const [divestInfo, setDivestInfo] = useState('');
  const [sharesToDivest, setSharesToDivest] = useState(null);
  const [poolInfo, setPoolInfo] = useState('');
  const [sharesInfo, setSharesInfo] = useState('');
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
          readonly={true}
        />
        <LabelOutput label='Current pool' value={poolInfo}/>
        <LabelOutput label='Your shares' value={sharesInfo}/>
      </div>
      <TxButton
        accountPair={accountPair}
        disabled={divestAssetError}
        attrs={{
          palletRpc: 'dexPalletModule',
          callable: 'divest',
          inputParams: [sharesToDivest, divestAsset],
          paramFields: [false, false]
        }}
        setStatus={setStatus}
        type='SIGNED-TX'
        label='Divest'
      />
    </div>
  );
}
