import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Redirect } from "react-router-dom"; 
import { hot } from 'react-hot-loader';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { config, configOnChain } from "@config";

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
  //subscribeXrpl,
  remoteUser,
  getUris,
} from "@store/actions";

import DashBoard from "@components/DashBoard";
import DataGridTx from "@components/DataGridTx";
import NoLoginContent from "@components/NoLoginContent";
import Template from "@components/Template";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";
import OpenMarket from "@components/OpenMarket";
import DisplayAd from "@components/DisplayAd";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { History } from 'history';
import { buildNamesList } from "@utils/helpers";

import { PictureCreator } from "@components/Profile";

// Faq Btn
import { FaqModal } from "@components/Faq";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface HomeSceneProps {
  history: History
}

const HomeScene: React.FC<HomeSceneProps> = (props) => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const [login, setLogin] = React.useState(false);
  const [wallet, setWallet] = React.useState(null);
  const [server, setServer] = React.useState('');
  const [jwt, setJwt] = React.useState('');
  const [walletType, setWalletType] = React.useState('');
  const dispatchRefresh = compose(dispatch, doRefresh);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetUser = compose(dispatch, getUser);
  //const dispatchSubscribe = compose(dispatch, subscribeXrpl);
  const dispatchRemoteUser = compose(dispatch, remoteUser);
  const dispatchGetUris = compose(dispatch, getUris);
  const [redirctTo, setRedirctTo] = useState(false);
  const [names, setNames] = useState(null);
  const chainList = configOnChain.filter(e => e.ready);
  const [helpBox, setHelpBox] = useState([]);
  
  useEffect(() => {
    if (!stateAccount.address) {
      dispatchRefresh();
    }
  }, []);

  useEffect(() => {
    if (stateUser.user && !stateUser.user.name) {
      setRedirctTo(true);
    }
  });

  useEffect(() => {
    if (wallet && walletType) {
      
      dispatchGetUser({ 
        address: wallet.address,
        walletType,
        jwt,
        server,
      });
    }
  }, [wallet, walletType])

  useEffect(() => {
    if (stateUser.users && !names)
      setNames(buildNamesList(stateUser.users.results))
  }, [stateUser.users])

  const handleWallet = (walletType: string, wallet: {[key:string]: string}, jwt?: string, server?: string) => {
    setJwt(jwt);
    setWalletType(walletType);
    if (server)
      setServer(server);

    // must be in last
    setWallet(wallet);
    if (walletType !== 'bridge')
      setLogin(false);
  }

  const handleClickAd = (address: string) => {
    const user = stateUser.users.results.filter(elt => elt.address == address)[0];

    dispatchRemoteUser({ userRemote: user });
    dispatchGetUris({ address });
    props.history.push('/collection/'+ address);
  }

  const render = <React.Fragment>
      <Web3ProviderXRPL 
        handleWallet={handleWallet}
        handleClose={() => setLogin(!login)}
        visible={login}
        errorMsg={stateUser.errorMsg}
        appKey={config.appKey}
        clientUrl={config.clientURL}
        chainList={chainList}
        loading={stateAccount.loadingRefresh || stateUser.loadingGetOne || stateAccount.loadingAccount}
      />
      {(!stateAccount.address || !stateAccount.account) &&
        <NoLoginContent 
          login={() => setLogin(true)}
          loading={stateAccount.loadingRefresh || stateUser.loadingGetOne || stateAccount.loadingAccount}
        />
      }
      {stateAccount.address && stateAccount.account && stateUser.user && stateUser.user.name &&
        <Template
          isLogged={!!stateAccount.address}
          logout={dispatchLogout}
          user={stateUser.user}
        >
          {(stateAccount.loadingAccount || stateAccount.loadingTokens) && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
          <Container sx={{ mb: 5 }}>

            {helpBox && helpBox.length > 0 &&
              <FaqModal
                shouldInclude={helpBox}
                openDelay={0}
                onClose={() => setHelpBox([])}
              />}

            <Box onClick={() => setHelpBox([5, 37])}>
              <HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
            </Box>
            
            {stateUser.user.ad &&
              stateUser.user.ad.length &&  
              <Box
                sx={{ marginBottom: '15px' }}
              >
                <Typography sx={{ color: 'black' }}>Advertising</Typography>
                <Carousel
                  emulateTouch
                  infiniteLoop
                  showStatus={false}
                  showArrows={true}
                  showThumbs={false}
                  autoPlay
                  dynamicHeight
                >{stateUser.user.ad.map((elt, index) => 
                  <DisplayAd 
                    key={index}
                    date={elt.date}
                    duree={elt.duree}
                    message={elt.message}
                    userAddress={elt.user}
                    names={names}
                    onClick={handleClickAd}
                  />)}
                </Carousel>
              </Box>}

            <DashBoard 
              loading={stateAccount.loadingAccount || stateAccount.loadingTokens}
              name={stateUser.user.name}
              address={stateAccount.address}
              balance={stateAccount.account.account_data ? stateAccount.account.account_data.Balance : ''}
              nftsLength={stateUri.uris ? stateUri.uris.filter(e => e.validity && e.properties.owner === stateAccount.address).length : 0}
              nftsLimit={stateUser.user.pocket}
            />
            <Paper elevation={3} sx={{ mt: 2, minHeight: 250, padding: '10px 25px' }}>
              <Box sx={{ flexGrow: 1, mb: 1, maxHeight: '300px', minHeight: '200px', height: '100%', overflow: 'auto' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">Buy offers:</Typography>
                    <OpenMarket
                      uris={stateUri.uris}
                      owner={stateAccount.address}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            <Paper elevation={3} sx={{ background: '#222', mt: 2, minHeight: 250, padding: 4 }}>
              <DataGridTx
                loading={stateAccount.loadingTx}
                transactions={stateAccount.transactions}
                ownerAddr={stateAccount.address}
                ownerName={stateUser.user.name}
                names={names}
              />
            </Paper>
          </Container>
        </Template>
      }
    </React.Fragment>;

  return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(HomeScene);