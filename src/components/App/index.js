import React, { Suspense } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Node from '../Node';
import Account from '../Account';
import SwapMarket from '../SwapMarket';
import PoolMarket from '../PoolMarket';
import TakeMarket from '../TakeMarket';
import { RedirectToSwapMarket } from '../../utils/redirects';
import './app.css';

export default function App () {
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Node/>
        <Account/>
        <Switch>
          <Route exact strict path="/swap" component={SwapMarket} />
          <Route exact strict path="/pool" component={PoolMarket} />
          <Route exact strict path="/take" component={TakeMarket} />
          <Route component={RedirectToSwapMarket} />
        </Switch>
      </HashRouter>
    </Suspense>
  );
}
