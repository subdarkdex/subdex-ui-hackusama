import useSubstrate from '../../hooks/useSubstrate';
import React, { useEffect, useState } from 'react';
import { convertBalance } from '../../utils/conversion';
import { assetMap } from '../../assets';
import PropTypes from 'prop-types';

function BalanceAnnotation (props) {
  const { assetId, address, className, label, showAssetSymbol } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;
    assetId !== undefined && assetId !== null && address &&
    api.query.genericAsset.freeBalance(assetId, address, balance => {
      setAccountBalance(convertBalance(assetId, balance.toString()).toNumber());
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, assetId, address]);

  return address ? (
    <div className={className}>
      {label || ''}{accountBalance} {showAssetSymbol && assetMap.get(assetId).symbol}
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
