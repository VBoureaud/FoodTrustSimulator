import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { RouteComponentProps, Redirect, useHistory, useLocation } from "react-router-dom";
import { hot } from 'react-hot-loader';

import { 
  logout,
  getTokens,
  getAccount,
  resetRemote,
} from "@store/actions";

import { 
  dataGet,
} from "@utils/helpers";

import { 
  profilesGame,
  levelDisplay,
} from "@utils/gameEngine";

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { AppState } from "@store/types";
import Template from "@components/Template";
import ListNfts, { NftsIcon } from "@components/ListNfts";
import { decodeHashURI, buildNamesList, displayDiffDate } from "@utils/helpers";
import { PictureCreator, ProfileInfo, ProfileBadges } from "@components/Profile";

// Faq Btn
import { FaqModal } from "@components/Faq";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import './CollectionScene.less';

// needed XRPL class 
if (typeof module !== "undefined") var xrpl = require('xrpl');

type Filters = {
  [key: string]: {
    show: boolean;
    name: {
      en: string;
      fr: string;
    },
    type?: string;
    nfts?: any,
    uris?: any,
    default: boolean,
  }
}

interface RouteParams {
  id: string,
}

interface Props extends RouteComponentProps<RouteParams> {
  //history: History
}

const CollectionScene: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetTokens = compose(dispatch, getTokens);
  const dispatchAccount = compose(dispatch, getAccount);
  const dispatchResetRemote = compose(dispatch, resetRemote);
  const [redirctTo, setRedirctTo] = useState(false);
  // list of filters
  const filters: Filters = {
    issuer: {
      show: true,
      default: false,
      name: {
        en: 'Issuer',
        fr: 'Emetteur',
      },
    },
    nameToken: {
      show: false,
      default: false,
      name: {
        en: 'Token Name',
        fr: 'Token Name',
      },
      type: 'select',
    },
    creator: {
      show: false,
      default: false,
      name: {
        en: 'Craftsmanship',
        fr: 'Métier',
      },
      type: 'select',
    },
    validity: {
      show: true,
      default: false,
      name: {
        en: 'Unvalidated',
        fr: 'Non validé',
      },
    },
    offerBuy: {
      show: true,
      default: false,
      name: {
        en: 'With offers',
        fr: 'Avec des offres',
      },
    },
    parents: {
      show: true,
      default: false,
      name: {
        en: 'Merged',
        fr: 'Fusionné',
      },
    }
  };
  const filtersValid = Object.keys(filters).filter(e => filters[e].show);
  const [checked, setChecked] = React.useState([...Array(filtersValid.length)].map((e: undefined, i: number) => filters[filtersValid[i]].default));
  const history = useHistory();
  const location = useLocation();
  const [collection, setCollection] = React.useState(null);
  const [helpBox, setHelpBox] = useState([]);
  
  useEffect(() => {
    if (!stateUser.user || !stateUser.user.name) {
      setRedirctTo(true);
    } else if (collection === null && stateAccount.nfts) {
      buildCollection();
    }
  })

  useEffect(() => {
    if (stateAccount.nfts) {
      buildCollection();
    }
  }, [location])

  useEffect(() => {
    if (stateUri.uris && stateAccount.nfts)
      buildCollection();
  }, [stateAccount.loadingRemoteTokens, stateUri.uris])

  const handleBack = () => {
    history.goBack();
    dispatchResetRemote({ remote_account: null, remote_nfts: null });
  }

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>, position: number) => {
    const currentChecked = checked;
    currentChecked[position] = event.target.checked;
    setChecked([ ...currentChecked ]);
    buildCollection();
  };

  const buildCollection = () => {
    const isRemote = !!props.match.params.id;
    let uris = stateUri.uris.map((e) => ({
      ...e,
      tokenType: e.image,
      tokenDate: decodeHashURI(xrpl.convertHexToString(e.name)).date,
      tokenIssuer: decodeHashURI(xrpl.convertHexToString(e.name)).address,
      tokenOwner: e.properties.owner,
    }));

    /*let sizeCollec = stateUser.user.pocket > stateAccount.nfts.length 
      ? stateUser.user.pocket
      : stateAccount.nfts.length;*/
    let sizeCollec = stateUser.user.pocket; 
    const actifFilters = !isRemote ? filtersValid
      .map((e: any, i: number) => checked[i] ? e : false)
      .filter(e => e)
      : [];
    if (isRemote) {
      uris = uris.filter(e => 
        e.properties.owner == stateUser.userRemote.address
        && e.validity);
      sizeCollec = uris.length;
    } else {
      uris = uris.filter(e => 
        e.properties.owner == stateUser.address);
    }

    // no filter if remote
    if (actifFilters.indexOf('validity') != -1) {
      uris = uris.filter(e => !e.validity);
      sizeCollec = uris.length;
    } else if (!isRemote) {
      uris = uris.filter(e => e.validity && e.tokenOwner === stateUser.address);
    }
    if (actifFilters.indexOf('issuer') != -1) {
      uris = uris.filter(e => e.tokenIssuer == e.properties.owner);
      sizeCollec = uris.length;
    }
    if (actifFilters.indexOf('offerBuy') != -1) {
      uris = uris.filter(e => e.properties.offerBuy.length > 0);
      sizeCollec = uris.length;
    }
    if (actifFilters.indexOf('parents') != -1) {
      uris = uris.filter(e => e.properties.parents.length > 0);
      sizeCollec = uris.length;
    }

    if (!sizeCollec) {
      setCollection([(
        <h3 key="1">Nothing to see yet.</h3>
      )]);
      return true;
    }

    const defaultCollec = [...Array(sizeCollec).keys()]
      .map((e, index) => {
        return (
          <span
            key={index}
            style={{ position: 'relative' }}
            className="nftsIconSeparator">
            {isRemote 
              && uris[index].properties.offerSell.length > 0
              && <span style={{
                position: 'absolute',
                left: '0px',
                right: '0px',
                textAlign: 'center',
                background: '#ff6c24',
                color: 'white',
                bottom: '0px',
                boxShadow: '0px 1px 1px #d0a635',
                zIndex: 2,
              }}>Buy now</span>}
            <NftsIcon
              nftTokenName={uris[index] ? uris[index].name : ''}
              user={stateUser.address}
              tokenType={uris[index] ? uris[index].tokenType : ''}
              tokenDate={uris[index] ? uris[index].tokenDate : ''}
              tokenIssuer={uris[index] ? uris[index].tokenIssuer : ''}
              tokenOwner={uris[index] ? uris[index].tokenOwner : ''}
              validity={uris[index] ? uris[index].validity : true}
              names={stateUser.users ? buildNamesList(stateUser.users.results) : []}
            />
          </span>
        )
      }
    );
    setCollection(defaultCollec);
    return true;
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
        user={stateUser.user}
      >
      <Container sx={{ mb: 5, color: 'black' }}>
        {helpBox && helpBox.length > 0 &&
          <FaqModal
            shouldInclude={helpBox}
            openDelay={0}
            onClose={() => setHelpBox([])}
          />}

        <Box onClick={() => setHelpBox([props.match.params.id ? 39 : 25])}>
          <HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
        </Box>

        {!props.match.params.id && stateUri.uris && stateUser.user && <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: "400" }}>Collection</Typography>
            <Typography sx={{ fontSize: '25px', marginLeft: '15px' }}>{stateUri.uris.filter(e => e.validity && e.properties.owner === stateUser.address).length} / {stateUser.user.pocket}</Typography>
          </Box>
        }
        {(stateAccount.loadingRemoteTokens || stateAccount.loadingTokens || stateUri.loading)
          && <Box sx={{ p: 1 }}>
          <CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
        </Box>}

        {!props.match.params.id
          && !stateUri.loading
          && <div className="collectionBackground">
                <div className="collectionFilter">
                  {checked.map((elt, i) => (
                      <FormControlLabel
                        key={i}
                        label={filters[filtersValid[i]].name['en']}
                        control={<Checkbox checked={checked[i]} onChange={(e) => handleFilter(e, i)} />}
                      />
                  ))}
                </div>

               <div className="collectionContainer">
                  {collection}
                </div>
              </div>}

        {props.match.params.id && !stateAccount.loadingRemoteTokens && <Button onClick={handleBack} sx={{ m: 2, color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
        {props.match.params.id && !stateAccount.loadingRemoteTokens && <Typography sx={{ lineHeight: '25px', marginBottom: '10px' }} variant="h2">{stateUser.userRemote ? stateUser.userRemote.name : ''}<span style={{ fontSize: '22px' }}>'s Collection & informations</span></Typography>}
        {props.match.params.id && !stateAccount.loadingRemoteTokens && <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Typography sx={{ lineHeight: '25px', marginBottom: '10px', fontSize: '14px' }} variant="body1">XRPL Address: {stateUser.userRemote ? stateUser.userRemote.address : ''}</Typography>
            <Typography>Latest Activity: {stateUser.userRemote ? displayDiffDate(stateUser.userRemote.lastCo) : ''} ago</Typography>
          </Box>}
        {props.match.params.id 
          && !stateAccount.loadingRemoteTokens 
          && <div className="collectionBackground">
               <div className="collectionContainer">
                  {collection}
                </div>
              </div>}
        {props.match.params.id 
          && !stateAccount.loadingRemoteTokens
          && stateUser.userRemote
          && <Box sx={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap' }}>
            <PictureCreator
              mode={0}
              imageDisplay={stateUser.userRemote.image}
              level={stateUser.userRemote.experience > 0 ? levelDisplay(stateUser.userRemote.experience) : 1}
              type={stateUser.userRemote.type}
              name={stateUser.userRemote.name}
              location={stateUser.userRemote.location.name}
            />
            <ProfileInfo
              loading={false}
              experience={stateUser.userRemote.experience}
              collection={stateUri.uris.filter(e => e.validity && e.properties.owner === stateUser.userRemote.address).length}
              pocket={stateUser.userRemote.pocket}
              offersValidated={stateUser.userRemote.transactions}
              minted={stateUri.uris.filter(e => e.properties.owner === stateUser.userRemote.address).length}
              burned={stateUri.uris.filter(e => !e.validity && e.properties.owner === stateUser.userRemote.address).length}
              // can cheat if minted outside game
              //minted={dataGet(stateAccount, 'remote_account.account_data.MintedNFTokens')}
              //burned={dataGet(stateAccount, 'remote_account.account_data.BurnedNFTokens')}
            />
            <ProfileBadges 
              loading={stateAccount.loadingRemoteAccount || stateAccount.loadingRemoteTokens}
              dataPlayer={{
                collection: stateUri.uris ? stateUri.uris.filter(e => e.validity && e.properties.owner === stateUser.userRemote.address).length : 0,
                pocket: stateUser.userRemote ? +(stateUser.userRemote.pocket > profilesGame[stateUser.userRemote.type].pocketSize) : 0,
                transaction: stateUser.userRemote ? stateUser.userRemote.transactions : 0,
                minted: stateUri.uris.filter(e => e.properties.owner === stateUser.userRemote.address).length,
                burned: stateUri.uris.filter(e => !e.validity && e.properties.owner === stateUser.userRemote.address).length,
                quests: stateUser.userRemote ? stateUser.userRemote.quest.length - 1 : 0,
                firstScore: stateUser.users && stateUser.users.results && stateUser.userRemote ? +(stateUser.users.results.slice().sort((a, b) => b.experience - a.experience)[0].address === stateUser.userRemote.address) : 0,
                beginnerHelp: 0,
                burnout: 0,
                level: stateUser.userRemote ? levelDisplay(stateUser.userRemote.experience) : 0,
              }}
            />
          </Box>}
      </Container>
    </Template>;

  return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(CollectionScene);