import useSubstrate from '../../hooks/useSubstrate';
import React, { useEffect, useState } from 'react';
import { convertBalance, shortenNumber } from '../../utils/conversion';
import { assetMap } from '../../assets';
import PropTypes from 'prop-types';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

function BalanceAnnotation (props) {
  const { assetId, address, className, label, showAssetSymbol } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(' '); // KEEP the space, it's required by Tooltip

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;
    assetId !== undefined && assetId !== null && address &&
    api.query.genericAsset.freeBalance(assetId, address, balance => {
      setAccountBalance(convertBalance(assetId, balance.toString()).toString());
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, assetId, address]);

  return address ? (
    <div className={className}>
      {label || ''}
      <Tooltip
        html={accountBalance}
        duration={1000}
        animation='fade'
        position='bottom'
        trigger='mouseenter'
        arrow={true}
      >
        {shortenNumber(accountBalance)}
      </Tooltip>
      {showAssetSymbol && assetMap.get(assetId).symbol}
    </div>
  ) : null;
}

BalanceAnnotation.propTypes = {
  assetId: PropTypes.string.isRequired,
  address: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  showAssetSymbol: PropTypes.bool
};

export default BalanceAnnotation;
