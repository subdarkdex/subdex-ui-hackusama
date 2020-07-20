import React from 'react';
import logo from './logo.png';
import Panel from '../Panel';
import './market.css';

function Market (props) {
  const { marketPlace, marketEvents } = props;
  return (
    <>
      <div className='market'>
        <img className='logo' src={logo} alt='Logo'/>
        <Panel>
          {marketPlace}
        </Panel>
        <Panel>
          {marketEvents}
        </Panel>
      </div>
    </>
  );
}

export default Market;
