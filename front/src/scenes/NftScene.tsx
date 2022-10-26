import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { hot } from "react-hot-loader";
import { History } from "history";
import { decodeHashURI, displayDate, unPad } from "@utils/helpers";
import { nameTypeToken } from "@utils/gameEngine";
import { config } from "@config";

import '@utils/TypeToken.less';

import { 
  logout,
  getOffers,
  getTokens,
  getAccount,
  getUser,
  getRemoteTokens,
  getUris,
  addUri,
  getHistory,
} from "@store/actions";

import { 
  createBuyOffer,
  createSellOffer,
  cancelOffer,
  acceptOffer,
  burnToken,
  updateUri,
} from "@store/api";

import {
  Offers,
} from "@store/types/NftTypes";
import { 
  Uri,
} from "@store/types/UriTypes";

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { AppState } from "@store/types";
import Template from "@components/Template";
import XRPLBridge from "@components/XRPLBridge";
import FormDialog from "@components/FormDialog";
import ListOffers from "@components/ListOffers";
import WorldMap from "@components/WorldMap";
import ListSimple from "@components/ListSimple";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";

interface RouteParams {
  id: string,
}

interface Props extends RouteComponentProps<RouteParams> {
  history: History
}

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl')

const historyLineBuilder = (history: any) => {
  const result = [];
  for (let i = 0; i < history.length; i++) {
    if (i + 1 < history.length)
      result.push({
        start: [ history[i].lng, history[i].lat ],
        end: [ history[i + 1].lng, history[i + 1].lat ],
      })
  }
  return result;
}

const NftScene: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateNft = useSelector((state: AppState) => state.nftReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetOffers = compose(dispatch, getOffers);
  const dispatchGetTokens = compose(dispatch, getTokens);
  const dispatchAccount = compose(dispatch, getAccount);
  const dispatchUser = compose(dispatch, getUser);
  const dispatchRemoteTokens = compose(dispatch, getRemoteTokens);
  const dispatchGetUris = compose(dispatch, getUris);
  const dispatchAddUri = compose(dispatch, addUri);
  const dispatchHistory = compose(dispatch, getHistory);
  const [redirctTo, setRedirctTo] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [uriInfo, setUriInfo] = useState(null);
  const [isRemoteToken, setIsRemoteToken] = useState(false);
  const [nftToDelete, setNftToDelete] = useState(false);
  const [payloadXRPL, setPayloadXRPL] = useState(null);

  // Offer
  const [offerValue, setOfferValue] = useState(''); // when do an offer
  const [offerBuyIndex, setOfferBuyIndex] = useState(''); // when accept an offer
  const [offerSellIndex, setOfferSellIndex] = useState(''); // when accept an offer
  const [makeBuyOffer, setMakeBuyOffer] = useState(false);
  const [makeSellOffer, setMakeSellOffer] = useState(false);
  const [cancelSellOfferIndex, setCancelSellOfferIndex] = useState('');
  const [cancelBuyOfferIndex, setCancelBuyOfferIndex] = useState('');
  const establishedOffer = (account: string, offers: Offers[]) => {
    if (!offers) return false;
    return offers.filter((elt: Offers) => elt.owner == account).length > 0;
  }

  useEffect(() => {
    if (!stateUser.user) {
      setRedirctTo(true);
    } else if (!stateNft.tokenId || stateNft.tokenId != props.match.params.id) {
      dispatchGetOffers({ tokenId: props.match.params.id });
      dispatchHistory({ tokenId: props.match.params.id });
    } else if (!tokenInfo || !uriInfo) {
      setTokenInfo(getTokenInfo(props.match.params.id));
      setUriInfo(getUriInfo(props.match.params.id));
    }
  })

  // Make Offer
  useEffect(() => {
    if (offerValue && !uriInfo) {
      handleInit();
      throw new Error("Cannot make Offer if URI not found.");
    }

    if (makeBuyOffer && offerValue) {
      const payload = createBuyOffer(
        stateAccount.remote_address,
        offerValue,
        props.match.params.id,
      );
      setPayloadXRPL(payload);
    } else if (makeSellOffer && offerValue) {
      const payload = createSellOffer(
        offerValue,
        props.match.params.id,
      );
      setPayloadXRPL(payload);
    }

  }, [offerValue])

  // Cancel Offer
  useEffect(() => {
    if (cancelSellOfferIndex || cancelBuyOfferIndex)
      setPayloadXRPL(
        cancelOffer(
          cancelBuyOfferIndex
          ? cancelBuyOfferIndex
          : cancelSellOfferIndex)
      );
  }, [cancelBuyOfferIndex, cancelSellOfferIndex])

  // Accept Offer
  useEffect(() => {
    if (offerBuyIndex || offerSellIndex)
      setPayloadXRPL(
        acceptOffer(
          !!offerBuyIndex,
          offerBuyIndex
          ? offerBuyIndex
          : offerSellIndex)
      );
  }, [offerBuyIndex, offerSellIndex])
  
  // Burn NftToken
  useEffect(() => {
    if (nftToDelete)
      setPayloadXRPL(
        burnToken(props.match.params.id)
      );
  }, [nftToDelete])

  const handleInit = () => {
    setOfferValue('')
    setMakeBuyOffer(false);
    setMakeSellOffer(false);
    
    setCancelBuyOfferIndex('')
    setCancelSellOfferIndex('')

    setOfferBuyIndex('');
    setOfferSellIndex('');

    setNftToDelete(false);

    setPayloadXRPL(null);
  }

  // after success on XRPL
  const handleTransaction = async (data: any) => {
    // When make an offer
    if (makeBuyOffer) {
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        offerBuy: stateAccount.address
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);
    }
    // if (makeSellOffer) {}
    if (makeBuyOffer || makeSellOffer)
      dispatchGetOffers({ tokenId: props.match.params.id });

    // --------------------
    // When cancel an Offer
    if (cancelBuyOfferIndex) {
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        offerBuy: stateAccount.address
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);
    }
    //if (cancelSellOfferIndex) {}
    if (cancelSellOfferIndex || cancelBuyOfferIndex)
      dispatchGetOffers({ tokenId: props.match.params.id });

    // --------------------
    // When accept an Offer
    if (offerBuyIndex) {
      // NFT owner != current account
      const offerBuyAddress = stateNft.buyOffers ? stateNft.buyOffers.filter(e => e.nft_offer_index == offerBuyIndex) : [];
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        owner: offerBuyAddress[0].owner,
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);
    }
    if (offerSellIndex) {
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        owner: stateAccount.address,
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);

      // update remote token
      dispatchRemoteTokens({
        remote_address: stateAccount.remote_address,
        remote_name: stateAccount.remote_name,
        remote_profile: stateAccount.remote_profile,
      });
      setTokenInfo(getTokenInfo(props.match.params.id));
      setUriInfo(getUriInfo(props.match.params.id));
    }
    if (offerBuyIndex || offerSellIndex) {
      await dispatchUser({ address: stateAccount.address });
      await dispatchGetOffers({ tokenId: props.match.params.id });
      await dispatchHistory({ tokenId: props.match.params.id });
      props.history.goBack();
    }

    // --------------------
    // When burn an NftToken
    if (nftToDelete) {
      dispatchGetTokens({ address: stateAccount.address });
      dispatchAccount({ address: stateAccount.address });
      props.history.goBack();
    }

    handleInit();
  }

  const handleCancelOffer = (offers: Offers[]) => {
    const ownerOffer = offers.filter((elt: Offers) => elt.owner == stateAccount.address);
    if (!ownerOffer.length) return false; // not be possible
    if (stateNft.buyOffers == offers) setCancelBuyOfferIndex(ownerOffer[0].nft_offer_index);
    else setCancelSellOfferIndex(ownerOffer[0].nft_offer_index);
  }

  // FormDialog
  const dialogOffer = <span>Enter your offer in XRP</span>;
  const onFormDialogCheckData = (value: string) => {
    if (isNaN(parseInt(value)) || parseInt(value) < 0)
      return false;
    const currentValue = xrpl.xrpToDrops(value);
    const currentBalance = stateAccount.account.account_data.Balance;
    if (BigInt(currentValue) > BigInt(currentBalance)) return false;
    return true;
  }
  const onFormDialogConfirm = (value: string) => {
    setOfferValue(xrpl.xrpToDrops(value));
  }

  const getUriInfo = (tokenID: string) => {
    const uriInfo:Uri[] = stateUri.uris ? stateUri.uris.filter(e => e.properties.nftToken == tokenID) : [];
    return uriInfo ? uriInfo[0] : null;
  }

  const getTokenInfo = (tokenID: string) => {
    const userTokens = stateAccount.nfts ? stateAccount.nfts : [];
    const remoteTokens = stateAccount.remote_nfts ? stateAccount.remote_nfts : [];
    for (let i = 0; i < userTokens.length; i++)
      if (userTokens[i].NFTokenID == tokenID) {
        setIsRemoteToken(false);
        return userTokens[i];
      }
    for (let i = 0; i < remoteTokens.length; i++)
      if (remoteTokens[i].NFTokenID == tokenID) {
        setIsRemoteToken(true);
        return remoteTokens[i];
      }
    // must getTokens();
    return null;
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
      >
      
      <Web3ProviderXRPL
        handleClose={handleInit}
        visible={!!payloadXRPL}
        handleTransaction={handleTransaction}
        walletType={stateUser.walletType}
        currentJwt={stateUser.jwt}
        payload={payloadXRPL}
        xrplUrl={config.xrpWss}
        //errorMsg={stateUser.errorMsg}
      />

      {(makeBuyOffer || makeSellOffer) && !offerValue &&
        <FormDialog 
          title={'Make an Offer'}
          dialogText={dialogOffer}
          errorStr={'Confirmation failed. Wrong value or more than your current balance.'}
          typeField={'number'}
          labelField={'Offer'}
          onCancel={() => { 
            setMakeBuyOffer(false);
            setMakeSellOffer(false);
          }}
          checkData={onFormDialogCheckData}
          onConfirm={onFormDialogConfirm}
        />}

      <Container sx={{ mb: 5 }}>
        <Button onClick={props.history.goBack} sx={{ m: 2, color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {!uriInfo &&
                <Paper elevation={3} sx={{ wordBreak: 'break-word', minHeight: 280, padding: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <Typography variant="h6">No valid URI for this nftToken</Typography>
                  </Box>
                </Paper>}
              {uriInfo &&
                <Paper sx={{ background: '#ffedb9', minHeight: 280 }}>
                  <Box sx={{ m: 'auto' }} className={"nftToken type" + unPad(decodeHashURI(uriInfo.name).type)}></Box>
                </Paper>
              }
            </Grid>

            <Grid item xs={7}>
              <Paper elevation={3} sx={{ wordBreak: 'break-word', minHeight: 280, padding: 2 }}>
                <Typography variant="h6">Description</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {uriInfo
                    && <Box>
                      <Typography variant="h6"><span style={{ fontSize: '16px' }}>Reference:</span> {nameTypeToken[decodeHashURI(uriInfo.name).type].name.replace(/^\w/, c => c.toUpperCase())}</Typography>
                      <Typography variant="h6"><span style={{ fontSize: '16px' }}>Created:</span> {displayDate(decodeHashURI(uriInfo.name).date, true)}</Typography>
                    </Box>}
                  {tokenInfo
                    && <Box>
                      <Typography variant="h6"><span style={{ fontSize: '16px' }}>Transferable:</span> {tokenInfo.Flags == 8 ? 'True' : 'False'}</Typography>
                      <Typography sx={{ fontSize: '15px' }} variant="h6"><span style={{ fontSize: '16px' }}>TokenID:</span> {tokenInfo.NFTokenID}</Typography>
                    </Box>}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={5}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', wordBreak: 'break-word', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {isRemoteToken && <Typography variant="h6">The owner is: {stateAccount.remote_name} ({stateAccount.remote_profile}), {stateAccount.remote_address}</Typography>}
                  {!isRemoteToken && <Typography variant="h6">You are the owner</Typography>}
                </Box>
              </Paper>

              {!isRemoteToken && <Paper elevation={3} sx={{ mt: 2, background: 'tomato' }}>
                <Button sx={{ width: '100%', color: 'white' }} onClick={() => setNftToDelete(true)}>
                  <Typography>Delete?</Typography>
                </Button>
              </Paper>}
            </Grid>

            <Grid item xs={7}>
              <Paper elevation={3} sx={{ minHeight: 180, padding: 2 }}>
                <Typography variant="h6">Ready to Sell for:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {stateNft.loadingGetOffers && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
                  {!stateNft.loadingGetOffers &&
                    <ListOffers
                      doOfferTitle={'Make a price'}
                      doCancelTitle={'Cancel your price'}
                      canDoOffer={!isRemoteToken}
                      establishedOffer={establishedOffer(stateAccount.address, stateNft.sellOffers)}
                      listOffers={stateNft.sellOffers}
                      canGetOffer={isRemoteToken}
                      getOfferTitle={'Accept the price'}
                      handleGetOffer={(offerIndex: string) => setOfferSellIndex(offerIndex)}
                      handleMakeOffer={() => setMakeSellOffer(true)}
                      handleCancelOffer={handleCancelOffer}
                      emptyTitle={'No sell offer'}
                      currentAddr={stateAccount.address}
                    />}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                <Typography variant="h6">Ready to Buy for:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {stateNft.loadingGetOffers && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
                  {!stateNft.loadingGetOffers &&
                    <ListOffers
                      doOfferTitle={'Make an offer'}
                      doCancelTitle={'Cancel your offer'}
                      canDoOffer={isRemoteToken}
                      establishedOffer={establishedOffer(stateAccount.address, stateNft.buyOffers)}
                      listOffers={stateNft.buyOffers}
                      canGetOffer={!isRemoteToken}
                      getOfferTitle={'Accept offer'}
                      handleGetOffer={(offerIndex: string) => setOfferBuyIndex(offerIndex)}
                      handleMakeOffer={() => setMakeBuyOffer(true)}
                      handleCancelOffer={handleCancelOffer}
                      emptyTitle={'No buy offer'}
                      currentAddr={stateAccount.address}
                    />}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                <Typography variant="h6">History:</Typography>
                <ListSimple
                  listStr={
                    stateNft.history && stateNft.history.details
                    ? stateNft.history.details.map((e, i) => 
                      ((i == stateNft.history.details.length - 1) ? 'Created by ' : 'Bought by ') +
                      e.userName + ' from ' + e.name + ' ' + e.country
                    )
                    : []
                  }
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                {stateNft.history && stateNft.history.details && <WorldMap
                  markers={stateNft.history.details.map((elt) => ({
                      markerOffset: 15,
                      name: elt.name,
                      coordinates: [ elt.lng, elt.lat ],
                    }))}
                  lines={historyLineBuilder(stateNft.history.details)}
                  circleMarker
                />}
              </Paper>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
}

export default hot(module)(NftScene);