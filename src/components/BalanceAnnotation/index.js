import useSubstrate from '../../hooks/useSubstrate';
import React, { useEffect, useState } from 'react';

function BalanceAnnotation (props) {
  const { assetId, address, className, label } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;
    assetId !== undefined && assetId !== null && address &&
    api.query.genericAsset.freeBalance(assetId, address, balance => {
      setAccountBalance(balance.toHuman());
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, assetId, address]);

  return address ? (
    <div className={className}>
      {label || ''}{accountBalance}
    </div>
  ) : null;
}

export default BalanceAnnotation;
