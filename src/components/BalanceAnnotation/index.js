import useSubstrate from '../../hooks/useSubstrate';
import React, { useEffect, useState } from 'react';

function BalanceAnnotation (props) {
  const { address, className, label } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    address &&
    api.query.system.account(address, balance => {
      setAccountBalance(balance.data.free.toHuman());
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, address]);

  return address ? (
    <div className={className}>
      {label || ''}{accountBalance}
    </div>
  ) : null;
}

export default BalanceAnnotation;
