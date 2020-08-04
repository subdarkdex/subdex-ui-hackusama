import React from 'react';
import useSubstrate from '../../hooks/useSubstrate';
import './node.css';

export default function Node() {

  const { socket } = useSubstrate();

  return <div className='nodeContainer'>
    {socket}
  </div>;
}
