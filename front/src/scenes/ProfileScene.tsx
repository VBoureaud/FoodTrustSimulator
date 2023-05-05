import React, { useState, useEffect } from 'react';
import { compose } from "redux";
import { AppState } from "@store/types";
import { Store } from 'react-notifications-component';
import { 
  CreateUserPayload,
} from "@store/types/UserTypes";
import { 
  burnOut,
  createUser,
  logout,
  addSessionAction,
} from "@store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom"; 
import {
  levelDisplay,
  profilesGame,
  limitGame,
} from "@utils/gameEngine";
import { 
  dataGet,
  obj1HaveOrSupObj2,
  howManyDayBetweenTwoDate,
} from "@utils/helpers";

import { hot } from "react-hot-loader";
import { apiServer } from "@config";

import Template from "@components/Template";
import { ProfileCreator, PictureCreator, ProfileInfo, ProfileBadges } from "@components/Profile";
import { OpenMarketNotif } from "@components/OpenMarket";

// Faq
import { FaqModal } from "@components/Faq";
import BasicModal from "@components/Modal";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

type ProfileProps = {
  name: string;
  type: string;
  image: string;
  description: string;
  pocketSize: number;
  typeCount: number;
  typeRandom: boolean;
  sell:{
    farmer: number;
    manager: number;
    cook: number;
  };
};

const listProfiles: ProfileProps[] = Object.keys(profilesGame).map((elt: any) => ({
    name: elt,
    type: elt,
    image: profilesGame[elt].image,
    description: profilesGame[elt].description['en'],
    pocketSize: profilesGame[elt].pocketSize,
    typeCount: profilesGame[elt].typeCount,
    typeRandom: profilesGame[elt].typeRandom,
    sell: profilesGame[elt].sell,
  })
);

type Props = {};

const ProfileScene: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchCreate = compose(dispatch, createUser);
  const dispatchBurnout = compose(dispatch, burnOut);
  const dispatchAddAction = compose(dispatch, addSessionAction);
  const [redirctTo, setRedirctTo] = useState(false);
  const [burnOutMode, setBurnOutMode] = useState(false);
  const [helpBox, setHelpBox] = useState([]);

  useEffect(() => {
    if (!stateUser.user) {
      setRedirctTo(true);
    }
  });

  useEffect(() => {
    if (stateUser.errorBurnout)
      handleError('Failed burnout.');
  }, [stateUser.errorBurnout]);

  const handleBurnout = () => {
    const userBurnout = stateUser.user.burnout;
    if (userBurnout.length > 0 && howManyDayBetweenTwoDate(userBurnout[userBurnout.length - 1]) <= limitGame.maxDayBurnout) {
      handleError('You have reached the time limit before your next burn out. (' + (limitGame.maxDayBurnout * 24) + 'hours)');
    } else if (!stateUser.user.sessionAction || stateUser.user.sessionAction.indexOf('delete_002000') === -1) {
      handleError('Before to be able to burnout, you need to burn a Coin (created by manager).');
    }
    else {
      setBurnOutMode(true);
    }
  }

  const handleError = (msg: string) => {
    Store.addNotification({
      message: msg,
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

  const handleCreateProfil = (createUser: CreateUserPayload) => {
    if (burnOutMode) {
      dispatchBurnout({ image: createUser.image, type: createUser.type });
      setBurnOutMode(false);
    }
    else
      dispatchCreate({ ...createUser, server: stateUser.server });
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
        user={stateUser.user}
      >
      {helpBox && helpBox.length > 0 &&
        <FaqModal
          shouldInclude={helpBox}
          openDelay={0}
          onClose={() => setHelpBox([])}
        />}

      {stateUser.user && stateUser.user.type && !burnOutMode &&
        <Container sx={{ mb: 1 }}>
          <Box onClick={() => setHelpBox([30, 31, 32, 33, 41])}>
            <HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
          </Box>
        </Container>}

      {stateUser.user && stateUri.uris && stateUser.user.type && !burnOutMode &&
        <Container>
          <OpenMarketNotif
            uris={stateUri.uris}
            owner={stateAccount.address}
          />
        </Container>}

      {/* Welcome modal */}
      {stateUser.user 
        && stateUser.user.experience === 0 
        && stateUser.user.sessionAction
        && stateUser.user.sessionAction.indexOf('closeWelcomePopup') === -1 
        && !burnOutMode &&
        <BasicModal
          children={<Typography>
            Welcome aboard.<br /><br />
            Explore the application and find how to play, trade, and win level !<br /><br />
            Do not hesitate to consult the FAQ page to answer your questions during this gaming experience.<br /><br />
            <span style={{ float: 'right', fontStyle: 'italic' }}>Food Trust Simulator Team</span>
          </Typography>}
          autoOpen={true}
          showClose={true}
          onClose={() => dispatchAddAction({ action: 'closeWelcomePopup' })}
        />}

      {/* Create mode */}
      {stateUser.user 
        && !stateUser.user.type
        && !burnOutMode
        && <Container>
        <Box component="main" maxWidth="xl" sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ color: 'black', textAlign: 'center', fontSize: '30px' }}>Welcome in <span style={{ fontSize: '40px' }}>Food Trust Simulator</span>.</Typography>
        </Box>
        <Box component="main" maxWidth="xl" sx={{ mb: 5 }}>
          <ProfileCreator
            listProfiles={listProfiles}
            onClick={handleCreateProfil}
            apiServer={apiServer.getCities.url}
            loadingConfirm={stateUser.loadingCreate}
            errConfirm={stateUser.errorCreate}
          />
        </Box>
      </Container>}

      {/* Burn out Mode */}
      {stateUser.user
        && stateUser.user.type
        && burnOutMode
        && <Container>
          <Box component="main" maxWidth="xl" sx={{ mb: 4 }}>
            <Typography variant="h2" sx={{ color: 'black', textAlign: 'center', fontSize: '30px' }}>Burnout in <span style={{ fontSize: '40px' }}>Food Trust Simulator</span>.</Typography>
          </Box>
          <Box component="main" maxWidth="xl" sx={{ mb: 5 }}>
            <ProfileCreator
              listProfiles={listProfiles}
              onClick={handleCreateProfil}
              apiServer={apiServer.getCities.url}
              loadingConfirm={stateUser.loadingCreate}
              errConfirm={stateUser.errorCreate}
              burnout={true}
              currentProfile={stateUser.user.type}
            />
          </Box>
        </Container>}

      {/* Normal mode */}
      {stateUser.user 
        && stateUser.user.type
        && !burnOutMode
        && <Container>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {stateUser.loadingBurnout && <Box sx={{ position: 'fixed', top: 0, bottom: 0, right: 0, left: 0, background: '#808080b5', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '6' }}>
              <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />
            </Box>}
            <PictureCreator
                mode={0}
                imageDisplay={stateUser.user.image}
                level={stateUser.user.experience > 0 ? levelDisplay(stateUser.user.experience) : 1}
                type={stateUser.user.type}
                name={stateUser.user.name}
                location={stateUser.user.location.name}
              />

            <ProfileInfo
              loading={
                stateAccount.loadingAccount
                || stateUri.loading
                || stateAccount.loadingTokens
                || stateAccount.loadingTx}
              experience={stateUser.user ? stateUser.user.experience : 0}
              collection={stateUri.uris ? stateUri.uris.filter(e => e.validity && e.properties.owner === stateAccount.address).length : 0}
              pocket={stateUser.user ? stateUser.user.pocket : 0}
              offersValidated={stateUser.user ? stateUser.user.transactions : 0}
              minted={stateUri.uris ? stateUri.uris.filter(e => e.properties.owner === stateUser.user.address).length : 0}
              burned={stateUri.uris ? stateUri.uris.filter(e => !e.validity && e.properties.owner === stateUser.user.address).length : 0}
              // can cheat if minted outside game  
              //minted={dataGet(stateAccount, 'account.account_data.MintedNFTokens')}
              //burned={dataGet(stateAccount, 'account.account_data.BurnedNFTokens')}
            />

            <ProfileBadges 
              loading={
                stateAccount.loadingAccount
                || stateUri.loading
                || stateAccount.loadingTokens
                || stateAccount.loadingTx
              }
              dataPlayer={{
                collection: stateUri.uris ? stateUri.uris.filter(e => e.validity && e.properties.owner === stateAccount.address).length : 0,
                pocket: stateUser.user ? +(stateUser.user.pocket > profilesGame[stateUser.user.type].pocketSize) : 0,
                transaction: stateUser.user ? stateUser.user.transactions : 0,
                minted: stateUri.uris ? stateUri.uris.filter(e => e.properties.owner === stateUser.user.address).length : 0,
                burned: stateUri.uris ? stateUri.uris.filter(e => !e.validity && e.properties.owner === stateUser.user.address).length : 0,
                quests: stateUser.user ? stateUser.user.quest.length - 1 : 0,
                firstScore: stateUser.users && stateUser.users.results && stateUser.users.results.length > 0 ? +(stateUser.users.results.slice().sort((a, b) => b.experience - a.experience)[0].address === stateUser.user.address) : 0,
                beginnerHelp: 0,
                burnout: stateUser.user ? stateUser.user.burnout.length : 0,
                level: stateUser.user ? levelDisplay(stateUser.user.experience) : 0,
              }}
            />
 
          </Box>
          <Box
            onClick={handleBurnout} 
            sx={{ borderRadius: '5px', maxWidth: '110px', maxHeight: '66px', margin: '12px 10px', cursor: 'pointer', background: 'tomato', color: 'white', padding: '20px' }}>
            <Typography>Burnout ?</Typography>
          </Box>
        </Container>}

    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
};

export default hot(module)(ProfileScene);
