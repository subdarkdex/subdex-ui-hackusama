import React from 'react';
import Tabs from '../Tabs';
import TokenInput from '../TokenInput';
import assets from '../../assets';

export default function Swap () {
  const options = assets.map(({ assetId, symbol, logo }) => ({
    key: assetId,
    value: assetId,
    text: symbol,
    image: logo
  }));
  return (
    <>
      <Tabs active={'swap'}/>
      <span>Swap fields and buttons</span>
      <TokenInput options={options} label='From' placeholder='0.0'/>
    </>
  );
}
