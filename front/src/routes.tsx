import React from 'react';
import { compose } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '@store/index';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./themeContext";
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import { AppState } from "@store/types";
import NftScene from '@scenes/NftScene';
import HomeScene from '@scenes/HomeScene';
import ProfileScene from '@scenes/ProfileScene';
import ActivityScene from '@scenes/ActivityScene';
import ScoreBoardScene from '@scenes/ScoreBoardScene';
import QuestsScene from '@scenes/QuestsScene';
import NotificationScene from '@scenes/NotificationScene';
import CollectionScene from '@scenes/CollectionScene';
import MarketScene from '@scenes/MarketScene';
import FaqScene from '@scenes/FaqScene';
import NotFoundScene from '@scenes/NotFoundScene';
import WebSocketAbly from '@components/WebSocketAbly';

import { 
  getUser,
} from "@store/actions";

const mdTheme = createTheme(theme);

const Routes = () => {
  const dispatch = useDispatch();
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const dispatchGetUser = compose(dispatch, getUser);

  return (
    <ConnectedRouter history={history}>
      <ThemeProvider theme={mdTheme}>
        <ReactNotifications isMobile />
        <CssBaseline />
        {stateUser.user && 
          <WebSocketAbly
            channel={stateUser.user.address}
            callback={dispatchGetUser}
          />}
        <Switch>
          <Route exact path='/' component={HomeScene} />
          <Route exact path='/profile' component={ProfileScene} />
          <Route exact path='/play' component={ActivityScene} />
          <Route exact path='/quests' component={QuestsScene} />
          <Route exact path='/scoreboard' component={ScoreBoardScene} />
          <Route exact path='/collection' component={CollectionScene} />
          <Route exact path='/collection/:id' component={CollectionScene} />
          <Route exact path='/notifications' component={NotificationScene} />
          <Route exact path='/market' component={MarketScene} />
          <Route exact path='/faq' component={FaqScene} />
          <Route exact path='/nft/:id' component={NftScene} />
          <Route component={NotFoundScene} />
        </Switch>
      </ThemeProvider>
    </ConnectedRouter>
  );
}

export default Routes;
