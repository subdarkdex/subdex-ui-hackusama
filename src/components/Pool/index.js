import React, { useState } from 'react';
import Tabs from '../Tabs';
import OptionButton from '../OptionButton';
import PoolInvest from '../PoolInvest';
import './pool.css';
import PoolLaunch from '../PoolLaunch';

export default function Pool () {
  const [option, setOption] = useState('invest');
  return (
    <>
      <Tabs active={'pool'}/>
      <div className='pool-options-container'>
        <OptionButton selected={option === 'invest'} onClick={() => setOption('invest')}>
          Invest
        </OptionButton>
        <OptionButton selected={option === 'divest'} onClick={() => setOption('divest')}>
          Divest
        </OptionButton>
        <OptionButton selected={option === 'launch'} onClick={() => setOption('launch')}>
          Launch
        </OptionButton>
      </div>
      { option === 'invest' && <PoolInvest/> }
      { option === 'launch' && <PoolLaunch/> }
    </>
  );
}
