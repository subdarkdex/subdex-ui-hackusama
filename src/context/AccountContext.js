import React, { createContext, useState } from 'react';

const AccountContext = createContext(null);

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(null);
  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
