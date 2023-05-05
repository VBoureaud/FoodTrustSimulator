import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { hot } from "react-hot-loader";
import { History } from "history";
import { 
  decodeHashURI,
  displayDate,
  unPad,
  doPad,
  getObjInArray,
} from "@utils/helpers";
import { 
  buildProgress,
  nameTypeToken,
  translateImageSpecsToCss,
} from "@utils/gameEngine";
import { config, configOnChain } from "@config";
import { Store } from 'react-notifications-component';

// Faq
import { FaqModal } from "@components/Faq";
import BasicModal from "@components/Modal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import '@utils/TypeToken.less';

import { 
  logout,
  getOffers,
  getTokens,
  getAccount,
  getUser,
  remoteUser,
  getUris,
  getAllUsers,
  addUri,
  deleteUri,
  getParents,
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
  Parents,
} from "@store/types/NftTypes";
import { 
  Uri,
  UriHistory,
} from "@store/types/UriTypes";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

import { AppState } from "@store/types";
import Template from "@components/Template";
import FormDialog from "@components/FormDialog";
import ListOffers from "@components/ListOffers";
import WorldMap from "@components/WorldMap";
import ListSimple from "@components/ListSimple";
import ParentsDisplay from "@components/ParentsDisplay";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";
import CustomizedProgressBars from "@components/CustomizedProgressBars";
import HistoryLine from "@components/HistoryLine";

interface RouteParams {
  id: string,
}

interface Props extends RouteComponentProps<RouteParams> {
  history: History
}

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl')

const EnumActionHistory: {[key: string]: { name: string, color: string }} = {
  'createdHistory': { name: 'historyActionCreatedHistory', color: '#15ac10', },
  'created': { name: 'historyActionCreated', color: '#1677ff', },
  'sell': { name: 'historyActionSell', color: '#3ecc39', },
  'destroyed': { name: 'historyActionDestroyed', color: '#ff4d4f', },
  'freeze': { name: 'historyActionIced', color: '#2fafc4', },
  'bake': { name: 'historyActionHeated', color: '#fb7524', },
  'cooked': { name: 'historyActionCooked', color: '#ff4d7f', },
  'packaged': { name: 'historyActionPackaged', color: '#ff4d7f', },
}

const lang: {[key: string]: {[key: string]: string}} = {
  'en': {
    'historyActionCreatedHistory': 'Created by',
    'historyActionCreated': 'Created by',
    'historyActionSell': 'Bought by',
    'historyActionDestroyed': 'Destroyed by',
    'historyActionIced': 'Iced by',
    'historyActionHeated': 'Heated by',
    'historyActionCooked': 'Cooked by',
    'historyActionPackaged': 'Packaged by',
    'historyFrom': 'from',
    'historyMap': 'map',
    'historyPrice': 'for',
  },
  'fr': {
    'historyActionCreatedHistory': 'Créé par',
    'historyActionCreated': 'Créé par',
    'historyActionSell': 'Acheté par',
    'historyActionDestroyed': 'Detruit par',
    'historyActionIced': 'Gelé par',
    'historyActionHeated': 'Chauffé par',
    'historyActionCooked': 'Cuisiné par',
    'historyActionPackaged': 'Emballé par',
    'historyFrom': 'depuis',
    'historyMap': 'carte',
    'historyPrice': 'pour',
  },
};

type ParentsLine = {
  start: string[];
  end: string[];
  name?: string;
  address?: string;
  date?: Date;
  location?: string;
  tokenName?: string;
};

const parentsLineBuilder = (parents: Parents, result: ParentsLine[]) => {
  if (parents && parents.elt && parents.elt.user && parents.children.length) {
    for (let i = 0; i < parents.children.length; i++) {
      const currentChild = parents.children[i];
      if (currentChild.elt.user && currentChild.elt.user.address != parents.elt.user.address) {
        result.push({
          start: [ currentChild.elt.user.location.lng, currentChild.elt.user.location.lat ],
          end: [ parents.elt.user.location.lng, parents.elt.user.location.lat ],
          name: currentChild.elt.user.name,
          address: currentChild.elt.user.address,
          date: decodeHashURI(xrpl.convertHexToString(currentChild.elt.uri.name)).date,
          location: `${currentChild.elt.user.location.name} - ${currentChild.elt.user.location.country}`,
          tokenName:  decodeHashURI(xrpl.convertHexToString(currentChild.elt.uri.name)).type,
        });
      }
      if (currentChild.children.length)
        parentsLineBuilder(currentChild, result);
    }
  }
  return result;
}

const historyLineBuilder = (history: UriHistory[]) => {
  const result = [];
  for (let i = 0; i < history.length; i++) {
    if (!history[i].userInfo)
      continue;
    if (i + 1 < history.length && history[i].userInfo && history[i + 1].userInfo)
      result.push({
        start: [ history[i].userInfo.location.lng, history[i].userInfo.location.lat ],
        end: [ history[i + 1].userInfo.location.lng, history[i + 1].userInfo.location.lat ],
      });
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
  const dispatchRemoteUser = compose(dispatch, remoteUser);
  const dispatchGetUris = compose(dispatch, getUris);
  const dispatchAddUri = compose(dispatch, addUri);
  const dispatchDeleteUri = compose(dispatch, deleteUri);
  const dispatchGetParents = compose(dispatch, getParents);
  const dispatchGetAllUsers = compose(dispatch, getAllUsers);
  const [redirctTo, setRedirctTo] = useState(false);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [uriInfo, setUriInfo] = useState(null);
  const [isRemoteToken, setIsRemoteToken] = useState(false);
  const [nftToDelete, setNftToDelete] = useState(false);
  const [payloadXRPL, setPayloadXRPL] = useState(null);
  const [helpBox, setHelpBox] = useState([]);

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
    } else if (!stateNft.name || stateNft.name != props.match.params.id) {
      window.scrollTo(0, 0);
      handleLoad();
    }
  });

  useEffect(() => {
    // reset potential filter from marketScene
    dispatchGetAllUsers({
      searchValue: '',
      server: stateUser.server,
      usersPage: 1,
    });
    handleLoad();
  }, []);

  // Make Offer
  useEffect(() => {
    if (offerValue && !uriInfo) {
      handleInit();
      throw new Error("Cannot make Offer if URI not found.");
    }

    if (makeBuyOffer && parseInt(offerValue)) {
      const payload = createBuyOffer(
        stateUser.userRemote.address,
        offerValue,
        uriInfo.properties.nftToken,
      );
      setPayloadXRPL(payload);
    } else if (makeSellOffer && parseInt(offerValue)) {
      const payload = createSellOffer(
        offerValue,
        uriInfo.properties.nftToken,
      );
      setPayloadXRPL(payload);
    }

  }, [offerValue])

  // Update Offer
  useEffect(() => {
    if (!stateNft.loadingGetOffers) {
      const uri = getUriInfo(props.match.params.id);
      if (uri) setUriInfo(uri);
    }
  }, [stateNft.loadingGetOffers]);

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
    if (nftToDelete) {
      setPayloadXRPL(
        burnToken(uriInfo.properties.nftToken)
      );
    }
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

  const handleLoad = () => {
    const uri = getUriInfo(props.match.params.id);
    if (uri) {
      setUriInfo(uri);
      dispatchGetOffers({ tokenId: uri.properties.nftToken });
      dispatchGetParents({ name: props.match.params.id });
      setTokenInfo(getTokenInfo(props.match.params.id));
    }
  }

  const handleError = () => {
    Store.addNotification({
      message: 'Request Failed: insufficient funds or connection problem.',
      type: "danger",
      insert: "bottom",
      container: "bottom-left",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
        click: false,
        touch: false,
      }
    });
  }

  // after success on XRPL
  const handleTransaction = async (data: any) => {
    // if new offerBuy < than current offerSell
    let specialCaseDirectBuy = false;
    if (makeBuyOffer && uriInfo.properties && uriInfo.properties.offerSell.length > 0) {
      const currentOffer = uriInfo.properties.offerSell[0].split('_')[1];
      specialCaseDirectBuy = parseInt(offerValue) > parseInt(currentOffer);
    }
    // When make an offer
    if (!specialCaseDirectBuy && (makeBuyOffer || makeSellOffer)) {
      let uriUpdated;
      uriUpdated = await updateUri({ 
        name: uriInfo.name,
        offer: stateAccount.address + '_' + offerValue,
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);
      dispatchGetOffers({ tokenId: tokenInfo.NFTokenID });
    }

    // --------------------
    // When cancel an Offer
    if (cancelBuyOfferIndex || cancelSellOfferIndex) {
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        offer: stateAccount.address
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);
      dispatchGetOffers({ tokenId: tokenInfo.NFTokenID });
    }

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
    if (specialCaseDirectBuy || offerSellIndex) {
      const uriUpdated = await updateUri({ 
        name: uriInfo.name,
        owner: stateAccount.address,
      });
      if (!uriUpdated) throw new Error("Request Fail");
      dispatchAddUri(uriUpdated);

      dispatchRemoteUser({
        userRemote: stateUser.userRemote,
      });
      setTokenInfo(getTokenInfo(props.match.params.id));
      setUriInfo(getUriInfo(props.match.params.id));
    }
    if (offerBuyIndex || specialCaseDirectBuy || offerSellIndex) {
      await dispatchUser({ address: stateAccount.address });
      await dispatchGetOffers({ tokenId: tokenInfo.NFTokenID });
      props.history.goBack();
    }

    // --------------------
    // When burn an NftToken
    if (nftToDelete) {
      dispatchDeleteUri({
        name_to_delete: uriInfo.name,
        owner: uriInfo.properties.owner,
      });
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
    if (isNaN(parseInt(value)))
      return false;
    if (parseFloat(value) < 0.00001)
      return false;
    const currentValue = xrpl.xrpToDrops(value);
    const currentBalance = stateAccount.account.account_data.Balance;
    if (BigInt(currentValue) >= BigInt(currentBalance)) return false;
    return true;
  }
  const onFormDialogConfirm = (value: string) => {
    setOfferValue(xrpl.xrpToDrops(value));
  }

  // Get Uri from stateUri for name
  const getUriInfo = (name: string) => {
    const uris:Uri[] = stateUri.uris ? stateUri.uris.filter(e => e.name === name) : [];
    let uriInfo:Uri = uris && uris[0] ? uris[0] : null;
    if (uriInfo) {
      uriInfo.properties.history = uriInfo.properties.history.map((e: UriHistory, index: number) => ({
        ...e,
        userInfo: getObjInArray(stateUser.users.results, 'address', e.user),
      }))
    }
    return uriInfo;
  }

  // Get Token Info on-chain
  // Define if its remote or not
  const getTokenInfo = (name: string) => {
    const userTokens = stateAccount.nfts ? stateAccount.nfts : [];
    const remoteTokens = stateAccount.remote_nfts ? stateAccount.remote_nfts : [];
    for (let i = 0; i < userTokens.length; i++)
      if (userTokens[i].URI == name) {
        setIsRemoteToken(false);
        return userTokens[i];
      }
    for (let i = 0; i < remoteTokens.length; i++)
      if (remoteTokens[i].URI == name) {
        setIsRemoteToken(true);
        return remoteTokens[i];
      }
    // must getTokens();
    setIsRemoteToken(true);
    return null;
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
        user={stateUser.user}
      >
      <Web3ProviderXRPL
        handleClose={handleInit}
        visible={!!payloadXRPL}
        handleTransaction={handleTransaction}
        handleError={handleError}
        walletType={stateUser.walletType}
        currentJwt={stateUser.jwt}
        payload={payloadXRPL}
        xrplUrl={stateUser.user && stateUser.user.server ? getObjInArray(configOnChain, 'name', stateUser.user.server).url : config.xrpWss}
        //errorMsg={stateUser.errorMsg}
      />

      {(makeBuyOffer || makeSellOffer) && !parseInt(offerValue) &&
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
        {helpBox && helpBox.length > 0 &&
          <FaqModal
            shouldInclude={helpBox}
            openDelay={0}
            onClose={() => setHelpBox([])}
          />}

        <Box onClick={() => setHelpBox([8, 9, 11, 12, 26, 27, 28, 35, 36])}>
          <HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
        </Box>

        <Button onClick={props.history.goBack} sx={{ m: 2, color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>
        {uriInfo && !uriInfo.validity && <Alert sx={{ background: 'tomato', width: '100%', mb: 1, color: 'white' }} severity="error">
          This NFT Token is no more valid.
        </Alert>}
        <Box sx={{ flexGrow: 1 }}>
          <Grid columns={{ xs: 1, sm: 12, md: 12 }} container spacing={2}>
            
            {/* Display the NFT image */}
            <Grid item xs={5}>
              {!uriInfo &&
                <Paper elevation={3} sx={{ wordBreak: 'break-word', minHeight: 280, padding: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <Typography variant="h6">No valid URI for this nftToken</Typography>
                  </Box>
                </Paper>}
              {uriInfo &&
                <Paper sx={{ position: 'relative', background: '#ffedb9', minHeight: 280 }}>
                  <Box
                    style={{ 
                      margin: 'auto',
                      overflow: 'hidden',
                      maxWidth: '100%',
                      filter: translateImageSpecsToCss(uriInfo.image),
                      WebkitFilter: translateImageSpecsToCss(uriInfo.image),
                    }}
                    className={"nftToken type" + unPad(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).type)}>
                    </Box>
                    {uriInfo.properties.durability > 0 && buildProgress(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, uriInfo.properties.durability) <= 0 &&
                      <Tooltip title="You can no longer use it to validate a quest.">
                        <span className="expired">Expired</span>
                      </Tooltip>
                    }
                    <span className="powerDisplay">
                      <Tooltip title="Here is the value of the multiplier, used when validating the quest.">
                        <span className="hexagon hexagonYellow">
                          <span className="hexagonContent">
                            {uriInfo.properties.power}
                          </span>
                        </span>
                      </Tooltip>
                    </span>
                </Paper>
              }
            </Grid>

            {/* Display the NFT infos */}
            <Grid item xs={7} sx={{ maxWidth: '100%' }}>
              <Paper elevation={3} sx={{ wordBreak: 'break-word', padding: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {uriInfo
                    && <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                          <Typography variant="h5">
                            {nameTypeToken[decodeHashURI(xrpl.convertHexToString(uriInfo.name)).type].name.replace(/^\w/, (c: string) => c.toUpperCase()).replace('_', ' ')}
                          </Typography>
                          <Tooltip title={displayDate(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, true)} placement="top-start">
                            <Typography sx={{ mt: 1 }} variant="body1">{displayDate(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, false)}</Typography>
                          </Tooltip>
                        </Box>
                        <Typography sx={{ fontSize: '15px' }} variant="h6">{nameTypeToken[decodeHashURI(xrpl.convertHexToString(uriInfo.name)).type].desc}</Typography>
                        {uriInfo && uriInfo.properties.details && <Typography sx={{ color: 'white', fontSize: '18px' }}>{uriInfo.properties.details.split(';').length} ingredients for success.</Typography>}
                    </Box>
                  }
                  {tokenInfo
                    && <Box sx={{ mt: 2 }}>
                      {/*<Typography variant="h6"><span style={{ fontSize: '16px' }}>Transferable:</span> {tokenInfo.Flags == 8 ? 'True' : 'False'}</Typography>*/}
                      <Typography sx={{ fontSize: '15px', lineHeight: '15px' }} variant="h6">
                        <span style={{ fontSize: '16px' }}>Reference</span><br />
                        <span style={{ fontSize: '12px' }}>{tokenInfo.NFTokenID}</span>
                      </Typography>
                    </Box>}
                </Box>
              </Paper>

              {uriInfo && uriInfo.properties.details && 
                <Box sx={{ flexDirection: 'column', display: 'flex', mt: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', maxWidth: '100%', overflow: 'auto', paddingBottom: '15px' }}>
                    {uriInfo.properties.details.split(';').map((e: string, i: number) => (
                      <Tooltip
                        key={i}
                        title={nameTypeToken[e] ? nameTypeToken[e].name : 'Unknown'}>
                        <Box 
                          sx={{ 
                            background: '#faf8ebe6',
                            border: '1px solid #c6c6c6',
                            borderRadius: '4px',
                            width: 'fit-content',
                            marginTop: '10px',
                            marginRight: '10px',
                        }}>
                          <Box
                            className={"nftTokenMiddle middleType"+ unPad(e)}
                          ></Box>
                        </Box>
                      </Tooltip>
                      )
                    )}
                  </Box>
                </Box>}

              {uriInfo && uriInfo.properties.durability > 0 && <Paper elevation={3} sx={{ mt: 2, padding: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <span>Longevity:</span>
                  <span style={{ fontSize: '15px' }}>until 
                    <Tooltip title={displayDate(new Date(
                        decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date).getTime()
                        + (24 * 60 * 60 * 1000 * uriInfo.properties.durability), true)}>
                      <span style={{ marginLeft: '5px' }}>
                        {displayDate(new Date(
                          decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date).getTime()
                          + (24 * 60 * 60 * 1000 * uriInfo.properties.durability))}
                      </span>
                    </Tooltip>
                    </span>
                </Typography>
                
                {/* Expired */}
                {buildProgress(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, uriInfo.properties.durability) <= 0 &&
                  <CustomizedProgressBars
                    progress={100}
                    forcedColor={"tomato"}
                    showValue={0}
                  />
                }
                
                {/* Available */}
                {buildProgress(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, uriInfo.properties.durability) > 0 &&
                  <CustomizedProgressBars
                    progress={buildProgress(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, uriInfo.properties.durability)}
                    showValue={buildProgress(decodeHashURI(xrpl.convertHexToString(uriInfo.name)).date, uriInfo.properties.durability) + '%'}
                    colorGraduation
                  />
                }

              </Paper>}

            </Grid>

            {/* Display the owner Info */}
            {uriInfo && <Grid item xs={5}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', wordBreak: 'break-word', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  {isRemoteToken && stateUser.userRemote && <Typography variant="h6"><span style={{ fontSize: '18px', marginRight: '4px' }}>Owner is</span>
                    <Tooltip title={stateUser.userRemote.address}>
                      <strong>{stateUser.userRemote.name} ({stateUser.userRemote.type})</strong>
                    </Tooltip>
                  </Typography>}
                  {!isRemoteToken && <Typography variant="h6">You are the owner</Typography>}
                </Box>
              </Paper>

              {!isRemoteToken && <Paper elevation={3} sx={{ mt: 2, background: 'tomato' }}>
                <Button sx={{ width: '100%', color: 'white' }} onClick={() => setNftToDelete(true)}>
                  <Typography sx={{ letterSpacing: 2 }}>BURN</Typography>
                </Button>
              </Paper>}
            </Grid>}

            {/* Save the space */}
            <Grid item xs={7}></Grid>

            {/* Bid Box */}
            <Grid item xs={6}>
              {uriInfo && uriInfo.validity && <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                <Typography variant="h6">Bid</Typography>
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
                      users={stateUser.users && stateUser.users.results}
                      uriInfo={uriInfo}
                    />}
                </Box>
              </Paper>}
            </Grid>

            {/* Ask Box */}
            <Grid item xs={6}>
              {uriInfo && uriInfo.validity && <Paper elevation={3} sx={{ minHeight: 180, padding: 2 }}>
                <Typography variant="h6">Ask</Typography>
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
                      users={stateUser.users && stateUser.users.results}
                      uriInfo={uriInfo}
                    />}
                </Box>
              </Paper>}
            </Grid>

            {uriInfo && uriInfo.properties.parents.length > 0 && <Grid item xs={12}>
              <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                <ParentsDisplay
                  loading={stateNft.loadingParents}
                  parents={stateNft.parents}
                />
              </Paper>
            </Grid>}
            
            {uriInfo && <Grid sx={{ maxWidth: '100%' }} item xs={12}>
              <Paper elevation={3} sx={{ maxWidth: '100%', minHeight: 220, padding: 2 }}>
                <Typography variant="h6">History</Typography>
                  <ListSimple
                    background={"#347934"}
                    showEmpty={false}
                    listStr={
                      stateNft.parents ? parentsLineBuilder(stateNft.parents, []).map((e: any, index: number) => 
                        <HistoryLine
                          id={"p" + index}
                          date={displayDate(e.date, true)}
                          actionBackground={EnumActionHistory['createdHistory'].color}
                          actionName={lang['en'][EnumActionHistory['createdHistory'].name]}
                          accountAddress={e.address}
                          accountName={e.name}
                          textFrom={lang['en']['historyFrom']}
                          location={e.location ? e.location : ''}
                          textMap={lang['en']['historyMap']}
                          mapBackground={'green'}
                          tokenName={nameTypeToken[e.tokenName].name.replace(/^\w/, (c: string) => c.toUpperCase()).replace('_', '')}
                        />) : []}
                  />
                  <ListSimple
                    showEmpty={true}
                    listStr={
                      uriInfo.properties.history ? uriInfo.properties.history.map((e: UriHistory, index: number) => 
                        <HistoryLine
                          id={index}
                          date={displayDate(parseInt(e.date), true)}
                          actionBackground={EnumActionHistory[e.action] && EnumActionHistory[e.action].color}
                          actionName={lang['en'][EnumActionHistory[e.action] && EnumActionHistory[e.action].name]}
                          accountAddress={e.user}
                          accountName={e.userInfo && e.userInfo.name}
                          textFrom={lang['en']['historyFrom']}
                          location={e.userInfo ? `${e.userInfo.location.name} - ${e.userInfo.location.country}` : ''}
                          textMap={lang['en']['historyMap']}
                          mapBackground={'tomato'}
                          price={e.price ? xrpl.dropsToXrp(e.price) : null}
                          textPrice={lang['en']['historyPrice']}
                        />
                      ) : []}
                  />
              </Paper>
            </Grid>}

            {uriInfo && <Grid item xs={12}>
              <Paper elevation={3} sx={{ minHeight: 220, padding: 2 }}>
                {uriInfo && uriInfo.properties && uriInfo.properties.history && <WorldMap
                  markers={uriInfo.properties.history.map((elt: UriHistory) => ({
                      markerOffset: 15,
                      name: elt.userInfo && elt.userInfo.name,
                      coordinates: elt.userInfo ? [ elt.userInfo.location.lng, elt.userInfo.location.lat ] : [],
                    }))}
                  lines={historyLineBuilder(uriInfo.properties.history)}
                  linesParents={parentsLineBuilder(stateNft.parents, [])}
                  circleMarker
                />}
              </Paper>
            </Grid>}

          </Grid>
        </Box>
      </Container>
    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
}

export default hot(module)(NftScene);