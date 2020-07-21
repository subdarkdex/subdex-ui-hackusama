import React, { useState, useEffect } from 'react';
import useSubstrate from '../../hooks/useSubstrate';
import './account.css';
import { Dropdown } from 'semantic-ui-react';

function Main(props) {
  const { keyring } = useSubstrate();
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.address.substring(0, 4) + '...' + account.address.substring(account.address.length - 5, account.address.length),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountSelected(initialAddress);
  }, [initialAddress]);

  const onChange = address => {
    // Update state with new account address
    setAccountSelected(address);
  };

  return (
    <div className='account-container'>
      <div className='account-item-right'>
        <Dropdown fluid search selection
          placeholder='Select an account'
          options={keyringOptions}
          onChange={(_, dropdown) => {
            onChange(dropdown.value);
          }}
          value={accountSelected}
        />
      </div>
      <BalanceAnnotation accountSelected={accountSelected} />
    </div>
  );
}

function BalanceAnnotation(props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system.account(accountSelected, balance => {
        setAccountBalance(balance.data.free.toHuman());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);

  return accountSelected ? (
    <div className='account-item-left'>
      {accountBalance}
    </div>
  ) : null;
}

export default function Account(props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}