import React, { useState, useEffect, useContext } from 'react';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext.js';
import './account.css';
import { Dropdown } from 'semantic-ui-react';
import shorten from '../../utils/address';

function Main () {
  const { keyring } = useSubstrate();
  const { account, setAccount } = useContext(AccountContext);

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: shorten(account.address),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccount(initialAddress);
  }, [initialAddress, setAccount]);

  const onChange = address => {
    // Update state with new account address
    setAccount(address);
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
          value={account}
        />
      </div>
      <BalanceAnnotation accountSelected={account} />
    </div>
  );
}

function BalanceAnnotation (props) {
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

export default function Account () {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main /> : null;
}
