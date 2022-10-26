import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { config } from "@config";

import { 
  AppState,
} from "@store/types";
import { 
  AccountData,
  Nfts,
  Transactions,
} from "@store/types/AccountTypes";

import { 
  getUser,
  doRefresh,
  getTx,
  logout,
} from "@store/actions";

import DashBoard from "@components/DashBoard";
import DataGridTx from "@components/DataGridTx";
import NoLoginContent from "@components/NoLoginContent";
import Template from "@components/Template";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface HomeSceneProps {
}

const HomeScene: React.FC<HomeSceneProps> = (props) => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const [refreshed, setRefreshed] = React.useState(false);
  const [login, setLogin] = React.useState(false);
  const [wallet, setWallet] = React.useState(null);
  const [jwt, setJwt] = React.useState('');
  const [walletType, setWalletType] = React.useState('');
  const dispatchRefresh = compose(dispatch, doRefresh);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetUser = compose(dispatch, getUser);

  useEffect(() => {
    if (!refreshed && !stateAccount.address) {
      dispatchRefresh();
    }
  }, [])

  useEffect(() => {
    if (wallet && walletType)
      dispatchGetUser({ 
        address: wallet.address,
        walletType,
        jwt
      })
  }, [wallet, walletType])

  const handleWallet = (walletType: string, wallet: {[key:string]: string}, jwt?: string) => {
    setJwt(jwt);
    setWalletType(walletType);

    // must be in last
    setWallet(wallet);
    if (walletType !== 'bridge')
      setLogin(false);
  }

  return (
    <React.Fragment>
      <Web3ProviderXRPL 
        handleWallet={handleWallet}
        handleClose={() => setLogin(!login)}
        visible={login}
        errorMsg={stateUser.errorMsg}
        appKey={config.appKey}
        clientUrl={config.clientURL}
        faucet={config.faucet}
      />
      {(!stateAccount.address || !stateAccount.account) &&
        <NoLoginContent 
          login={() => setLogin(true)}
          loading={stateAccount.loadingRefresh || stateUser.loadingGetOne || stateAccount.loadingAccount}
        />}
      {stateAccount.address && stateAccount.account && stateUser.user &&
        <Template
          isLogged={!!stateAccount.address}
          logout={dispatchLogout}
        >
          {(stateAccount.loadingAccount || stateAccount.loadingTokens) && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
          <Container sx={{ mb: 5 }}>
            <DashBoard 
              loading={stateAccount.loadingAccount || stateAccount.loadingTokens}
              name={stateUser.user.name}
              profile={stateUser.user.profile}
              address={stateAccount.address}
              balance={stateAccount.account.account_data ? stateAccount.account.account_data.Balance : ''}
              nftsLength={stateAccount.nfts ? stateAccount.nfts.length : 0}
              nftsLimit={stateUser.user.pocket}
            />
            <Paper elevation={3} sx={{ mt: 2, minHeight: 250, padding: 4 }}>
              <DataGridTx
                loading={stateAccount.loadingTx}
                transactions={stateAccount.transactions}
                ownerAddr={stateAccount.address}
                ownerName={stateUser.user.name}
              />
            </Paper>
          </Container>
        </Template>
      }
    </React.Fragment>
  );
}

export default hot(module)(HomeScene);