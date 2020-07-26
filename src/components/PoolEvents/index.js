import React, { useContext, useEffect, useState } from 'react';
import { EventsContext } from '../../context/EventsContext';
import './pool-events.css';
import describe from '../../utils/time';

export default function PoolEvents () {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
  }, []);
  const { poolEvents } = useContext(EventsContext);
  return (
    <table className="pool-events">
      <thead>
        <tr>
          <th>Type</th>
          <th>Pair</th>
          <th>Shares</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={4}>&nbsp;</td>
        </tr>
        {poolEvents.map(({ type, asset, shares, time }) =>
          (
            <tr>
              <td>{type}</td>
              <td>{asset}/KSM</td>
              <td>{shares}</td>
              <td>{describe(currentTime - time)} ago</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
