import React, { createContext, useState, useEffect } from 'react';
import useSubstrate from '../hooks/useSubstrate';

const QUEUE_LENGTH = 19;

const EventsContext = createContext(null);

const EventsContextProvider = (props) => {
  const [swapEvents, setSwapEvents] = useState([]);
  const [poolEvents, setPoolEvents] = useState([]);
  const [takeEvents, setTakeEvents] = useState([]);
  const { api } = useSubstrate();
  useEffect(() => {
    api.query.system.events(events => {
      events.forEach(record => {
        const { event } = record;
        const eventName = event.method;
        const params = event.data.map((data) => data.toString());
        switch (eventName) {
          case 'Exchanged':
            setSwapEvents(e => {
              const copy = [
                {
                  soldAsset: params[0],
                  soldAmount: params[1],
                  boughtAsset: params[2],
                  boughtAmount: params[3],
                  time: Date.now()
                },
                ...e
              ];
              if (copy.length >= QUEUE_LENGTH) {
                copy.pop();
              }
              return copy;
            });
            break;
          case 'Invested':
            setPoolEvents(e => {
              const copy = [
                {
                  type: 'Add',
                  asset: params[0],
                  shares: params[1],
                  time: Date.now()
                },
                ...e
              ];
              if (copy.length >= QUEUE_LENGTH) {
                copy.pop();
              }
              return copy;
            });
            break;
          case 'Divested':
            setPoolEvents(e => {
              const copy = [
                {
                  type: 'Remove',
                  asset: params[0],
                  shares: params[1],
                  time: Date.now()
                },
                ...e
              ];
              if (copy.length >= QUEUE_LENGTH) {
                copy.pop();
              }
              return copy;
            });
            break;
          case 'Withdrawn':
            setTakeEvents(e => {
              const copy = [
                {
                  asset: params[0],
                  amount: params[1],
                  time: Date.now()
                },
                ...e
              ];
              if (copy.length >= QUEUE_LENGTH) {
                copy.pop();
              }
              return copy;
            });
            break;
          default:
            // do nothing
        }
      });
    });
  }, [api.query.system]);
  return (
    <EventsContext.Provider value={{ swapEvents, poolEvents, takeEvents }}>
      {props.children}
    </EventsContext.Provider>
  );
};

export { EventsContext, EventsContextProvider };
