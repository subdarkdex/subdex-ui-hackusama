import React, { useContext, useState, useEffect } from 'react';
import { EventsContext } from '../../context/EventsContext';
import './swap-events.css';
import describe from '../../utils/time';

export default function SwapEvents () {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const { swapEvents } = useContext(EventsContext);
  return (
    <table className="swap-events">
      <thead>
        <tr>
          <th className="swap-events-sold">Sold</th>
          <th className="swap-events-bought">Bought</th>
          <th className="swap-events-time">Time</th>
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
