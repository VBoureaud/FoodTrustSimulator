import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '@store/index';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./themeContext";

import NftScene from '@scenes/NftScene';
import HomeScene from '@scenes/HomeScene';
import LoginScene from '@scenes/LoginScene';
import ProfileScene from '@scenes/ProfileScene';
import ActivityScene from '@scenes/ActivityScene';
import CollectionScene from '@scenes/CollectionScene';
import MarketScene from '@scenes/MarketScene';
import NotFoundScene from '@scenes/NotFoundScene';

const mdTheme = createTheme(theme);

const Routes = () => (
  <ConnectedRouter history={history}>
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Switch>
        <Route exact path='/' component={HomeScene} />
        <Route exact path='/login' component={LoginScene} />
        <Route exact path='/profile' component={ProfileScene} />
        <Route exact path='/play' component={ActivityScene} />
        <Route exact path='/collection' component={CollectionScene} />
        <Route exact path='/collection/:id' component={CollectionScene} />
        <Route exact path='/market' component={MarketScene} />
        <Route exact path='/nft/:id' component={NftScene} />
        <Route component={NotFoundScene} />
      </Switch>
    </ThemeProvider>
  </ConnectedRouter>
);

export default Routes;
