import React, { createRef } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Node from '../Node';
import Account from '../Account';
import SwapMarket from '../SwapMarket';
import PoolMarket from '../PoolMarket';
import TakeMarket from '../TakeMarket';
import { RedirectToSwapMarket } from '../../utils/redirects';
import './app.css';
import useSubstrate from '../../hooks/useSubstrate';
import { SubstrateContextProvider } from '../../context';
import { Grid, Message, Dimmer, Loader } from 'semantic-ui-react';

function Main () {
  const { apiState, keyringState, apiError } = useSubstrate();

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to the Node'
          content={`${err}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') {
    return message(apiError);
  } else if (apiState !== 'READY') {
    return loader('Connecting to the Node');
  }

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <HashRouter>
        <Node/>
        <Account/>
        <Switch>
          <Route exact strict path="/swap" component={SwapMarket}/>
          <Route exact strict path="/pool" component={PoolMarket}/>
          <Route exact strict path="/take" component={TakeMarket}/>
          <Route component={RedirectToSwapMarket}/>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
