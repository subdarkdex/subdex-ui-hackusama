import React, { useState } from 'react';
import Hint from '../Hint';

export default function PoolInvest () {
  const defaultHint = 'Invest your tokens to the liquidity pool and earn 3% of the trading fees';
  const [hint, setHint] = useState(defaultHint);
  return (
    <div>
      <Hint text={hint}/>
    </div>
  );
}
