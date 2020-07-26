import React, { useState, useEffect, useContext } from 'react';
import useSubstrate from '../../hooks/useSubstrate';
import { AccountContext } from '../../context/AccountContext.js';
import './tokenInput.css';
import { Dropdown, Header } from 'semantic-ui-react';
import AssetsMap from '../../constants/AssetsMap';  // asset list
import AccountAssetBalanceMap from '../../constants/AccountAssetBalanceMap';  // mock assetId-account Balances

const Main = () => {

    // const { api } = useSubstrate();   // api for querying generic assets account balance by assetId and accountId
    const [selectedAsset, setSelectedAsset] = useState(Array.from(AssetsMap.keys())[0]); // default value is set to be KSM
    const [assetBalance, setAssetBalance] = useState(0.0);  // record the selected asset balance
    const [TokenInputNum, setTokenInputNum] = useState(0.0);  // record the number of token that user inputs

    const { account } = useContext(AccountContext);  // get the accont address from AccountContext

    // prepare for the dropdown options
    const assetsOptions = Array.from(AssetsMap.keys()).map(assetId => {

        // balance = api.query.GenericAsset.FreeBalance.contains_key(assetId, account) ?
        //     api.query.GenericAsset.FreeBalance.get(assetId, account) : 0;

        // Above two lines of code are for the actual looking up balaces from the generic asset pallet.
        // However, since the generic asset pallet is not ready now, I'm using a mockup Map to perform the balance storage fuctionality.
        // AccountAssetBalanceMap is the mockup map. We can use an Asset Id and a user account to look up user asset balance.
        // Also the AssetsMap stores a list of mockup asset Ids.
        // Below lines are for the testing scenario.

        let itemBalance = AccountAssetBalanceMap.has(assetId + ',' + account) ?
            AccountAssetBalanceMap.get(assetId + ',' + account) : 0;


        let assetMeta = AssetsMap.get(assetId);

        return {
            key: assetId,
            value: assetId,
            text: assetMeta.symbol,
            // image: assetMeta.logo,
            content: (
                <div>
                    <Header image={assetMeta.logo} content={assetMeta.symbol} subheader={assetMeta.description} className='dropdown_item_left' />
                    <div className='dropdown_item_right'>
                        {itemBalance}
                    </div>
                </div>
            ),
        };
    });  // as long as the account has some balance of some assetId, display the asset

    const initialAssetId = assetsOptions.length > 0 ? assetsOptions[0].value : '';


    // Set the dropdown initial assetId
    useEffect(() => {
        setSelectedAsset(initialAssetId);
    }, [initialAssetId, setSelectedAsset]);

    const onChange = (assetId) => {
        // Update state with new asset ID
        setSelectedAsset(assetId);
    };




    // When seletedAsset changes, update the balance annotation subscriptions
    // useEffect(() => {


    // If the user has selected an asset, create a new subscription
    // let unsubscribe;
    // selectedAsset && account &&
    //     api.query.GenericAsset.FreeBalance.get(selectedAsset, account, balance => {
    //         balance ? setAssetBalance(balance.data.free.toHuman()) : setAssetBalance(0);
    //     })
    // .then(unsub => {
    //     unsubscribe = unsub;
    // })
    // .catch(console.error);

    // return () => unsubscribe && unsubscribe();
    // }, [api, selectedAsset, account]);

    // The above lines of code is for actual balance lookup from the generic asset pallet.
    // For testing purpose, we will use the mock assetIdAccountBalanceMap instead.

    useEffect(() => {

        // If the user has selected an address, create a new subscription
        account && selectedAsset &&
            AccountAssetBalanceMap.has(selectedAsset + ',' + account) ?
            setAssetBalance(AccountAssetBalanceMap.get(selectedAsset + ',' + account)) : setAssetBalance(0);


    }, [account, selectedAsset]);



    return (
        <div className='TokenInputContainer'>

            <div className='TokenInput_right_items'>
                    <div className='DropdonwContainer'>
                        <Dropdown floating search selection
                            direction='right'
                            placeholder='Select a token'
                            options={assetsOptions}
                            onChange={(_, dropdown) => {
                                onChange(dropdown.value);
                            }}
                            value={selectedAsset}
                        />
                    </div>
                <div className='BalanceContainer'>
                    Balance: {assetBalance}
                </div>
            </div>

            <div className='TokenInput_left_items'>
                <div className='FormTagContainer'>
                    from
                </div>
                <div className='InputContainer'>
                    <input type='number' id='tkInput' max={assetBalance} min='0'
                        onChange={(e) => {
                            let num = e.target.value;
                            if (parseFloat(num) > assetBalance) {
                                setTokenInputNum(0);
                            } else if ((num.substring(0, 1) == '0') && (num.substring(1, 2) != '.')) {
                                setTokenInputNum(0);
                            }
                            else {
                                setTokenInputNum(parseFloat(e.target.value))
                            }
                        }}
                        value={TokenInputNum}
                    />
                </div>
            </div>
        </div>
    );
}



export default function TokenInput() {
    // const { api } = useSubstrate();
    const { account } = useContext(AccountContext);
    // return api.query && account ? <Main /> : null;
    return account ? <Main /> : null;
}