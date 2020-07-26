import React, { useContext, useState, useEffect } from 'react';
import { EventsContext } from '../../context/EventsContext';
import './swap-events.css';
import describe from '../../utils/time';

export default function SwapEvents () {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  }, []);
  const { swapEvents } = useContext(EventsContext);
  return (
    <table className="swap-events">
      <thead>
        <tr>
          <th style={{ width: '35%' }}>Sold</th>
          <th style={{ width: '35%' }}>Bought</th>
          <th style={{ width: '30%' }}>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr><td colSpan={3}>&nbsp;</td></tr>
        { swapEvents.map(({ soldAsset, soldAmount, boughtAsset, boughtAmount, time }) =>
          (
            <tr>
              <td>{soldAmount} {soldAsset}</td>
              <td>{boughtAmount} {boughtAsset}</td>
              <td>{describe(currentTime - time)} ago</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
