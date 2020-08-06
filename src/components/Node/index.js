import React, { useState, useContext } from 'react';
import useSubstrate from '../../hooks/useSubstrate';
import endpoints from '../../endpoints';
import { Dropdown } from 'semantic-ui-react';
import './node.css';
import { SubstrateContext } from '../../context/SubstrateContext';

export default function Node () {
  const { socket } = useSubstrate();
  const [currentSocket, setCurrentSocket] = useState(socket);
  const [state, dispatch] = useContext(SubstrateContext);

  const nodeOptions = endpoints.map(endpoint => ({
    key: endpoint.symbol,
    value: endpoint.value,
    text: endpoint.value,
    image: endpoint.logo
  }));

  const onChange = newSocket => {
    setCurrentSocket(newSocket);
    dispatch(
      {
        type: 'RESET_SOCKET',
        payload: newSocket
      }
    );
  };

  return (
    <div className='nodeContainer'>
      <div>
        <Dropdown fluid search selection
          placeholder='Select a Node'
          options={nodeOptions}
          onChange={(_, dropdown) => {
            onChange(dropdown.value);
          }}
          value={currentSocket}
        />
      </div>
    </div>);
}
