import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from "react-hot-loader";
import { 
  logout,
  getTokens,
  getAccount,
  getUser,
  addUri,
  createAd,
} from "@store/actions";

import { 
  mintToken,
  updateUri,
  registerUri,
  getTokensXRPL,
} from "@store/api";

import { 
  hashURI,
  unPad,
  countTokenFromProfile,
  getObjInArray,
  decodeHashURI,
} from "@utils/helpers";

import {
  Uri
} from '@store/types/UriTypes';
import {
  User
} from '@store/types/UserTypes';

import {
  limitGame,
  nameTypeToken,
  getRecipePercent,
  recipeCondition,
} from "@utils/gameEngine";

import { config, configOnChain } from "@config";

import "@utils/TypeToken.less";
import { AppState } from "@store/types";
import Template from "@components/Template";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";

import GameHoney from "@components/Game/GameHoney";
import GameAddition from "@components/Game/GameAddition";
import GameTickle from "@components/Game/GameTickle";
import GameConstrain from "@components/Game/GameConstrain";
import GameNoiseWave from "@components/Game/GameNoiseWave";
import GameSubstraction from "@components/Game/GameSubstraction";
import GameBrightness from "@components/Game/GameBrightness";
import GameMixToken from "@components/Game/GameMixToken";
import GameHeatToken from "@components/Game/GameHeatToken";
import GameIceToken from "@components/Game/GameIceToken";
import GameAd from "@components/Game/GameAd";
import GameBoxToken from "@components/Game/GameBoxToken";
import PocketFull from "@components/Game/PocketFull";
import ActivityDisplay from "@components/ActivityDisplay";

import Modal from '@mui/material/Modal';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

// Faq Btn
import { FaqModal } from "@components/Faq";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

//import './ActivityScene.less';
if (typeof module !== "undefined") var xrpl = require('xrpl');

type Game = {
  e: any,
  pocketShouldBeAvailable: boolean;
}
type GameMapper = {
  [x: string]: {
    e: any;
    pocketShouldBeAvailable: boolean;
  };
};

const gameMapper: GameMapper = {
  '000001': { e: GameHoney, pocketShouldBeAvailable: true },
  '000002': { e: GameTickle, pocketShouldBeAvailable: true },
  '000003': { e: GameConstrain, pocketShouldBeAvailable: true },
  '000004': { e: GameNoiseWave, pocketShouldBeAvailable: true },
  '000005': { e: GameSubstraction, pocketShouldBeAvailable: true },
  '000006': { e: GameBrightness, pocketShouldBeAvailable: true },
  '000007': { e: GameAddition, pocketShouldBeAvailable: true },
  '000008': { e: GameTickle, pocketShouldBeAvailable: true },
  '000009': { e: GameConstrain, pocketShouldBeAvailable: true },
  '000010': { e: GameNoiseWave, pocketShouldBeAvailable: true },
  '000011': { e: GameSubstraction, pocketShouldBeAvailable: true },
  '000012': { e: GameBrightness, pocketShouldBeAvailable: true },
  '000013': { e: GameHoney, pocketShouldBeAvailable: true },
  '000014': { e: GameTickle, pocketShouldBeAvailable: true },
  '000015': { e: GameConstrain, pocketShouldBeAvailable: true },
  '000016': { e: GameNoiseWave, pocketShouldBeAvailable: true },
  '000017': { e: GameHoney, pocketShouldBeAvailable: true },
  '000018': { e: GameBrightness, pocketShouldBeAvailable: true },
  '000019': { e: GameAddition, pocketShouldBeAvailable: true },
  '000020': { e: GameTickle, pocketShouldBeAvailable: true },
  '000021': { e: GameConstrain, pocketShouldBeAvailable: true },
  '000022': { e: GameNoiseWave, pocketShouldBeAvailable: true },
  '000023': { e: GameHoney, pocketShouldBeAvailable: true },
  '000024': { e: GameBrightness, pocketShouldBeAvailable: true },
  '000025': { e: GameSubstraction, pocketShouldBeAvailable: true },
  '000026': { e: GameTickle, pocketShouldBeAvailable: true },
  '000027': { e: GameConstrain, pocketShouldBeAvailable: true },
  '000028': { e: GameBrightness, pocketShouldBeAvailable: true },
  '001000': { e: GameBrightness, pocketShouldBeAvailable: true },// recipe cook
  'freeze': { e: GameIceToken, pocketShouldBeAvailable: false },//cook
  'bake': { e: GameHeatToken, pocketShouldBeAvailable: false },//cook
  'mix': { e: GameMixToken, pocketShouldBeAvailable: true },//cook
  'ad': { e: GameAd, pocketShouldBeAvailable: false },//manager
  '002000': { e: GameConstrain, pocketShouldBeAvailable: true },// manager_coin
  '002001': { e: GameBoxToken, pocketShouldBeAvailable: false },// manager_box
};

type Props = {};

const ActivityScene: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetTokens = compose(dispatch, getTokens);
  const dispatchUser = compose(dispatch, getUser);
  const dispatchAddUri = compose(dispatch, addUri);
  const dispatchCreateAd = compose(dispatch, createAd);
  const [loader, setLoader] = useState(false);
  const [redirctTo, setRedirctTo] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);  
  const [activity, setActivity] = React.useState(null);  
  const [playing, setPlaying] = React.useState(false);  
  const [nftWinner, setNftWinner] = useState(false);
  const [typeWinner, setTypeWinner] = useState(null);
  const [payloadXRPL, setPayloadXRPL] = useState(null);
  const [nftUri, setNftUri] = useState('');// register a new uri
  const [urisToUpdate, setUrisToUpdate] = useState([]); // update list of uri
  const [collection, setCollection] = useState(null);
  const [parents, setParents] = useState([]);
  const [helpBox, setHelpBox] = useState([]);
  

  useEffect(() => {
    if (!stateUser.user || !stateUser.user.name) {
      setRedirctTo(true);
    } else if (stateUri.uris && !collection) {
      updateCollection();
    }
  });

  useEffect(() => {
    if (stateUri.uris) {
      updateCollection();
    }
  }, [stateUri.uris]);

  useEffect(() => {
    //console.log({ playing });
  }, [playing]);

  // MintNft
  useEffect(() => {
    if (nftUri) { // mint a type
      const payload = mintToken(
        nftUri
      );
      setPayloadXRPL(payload);
    }
  }, [nftUri]);

  const updateCollection = () => {
    if (stateUri.uris) {
      setCollection(
        stateUri.uris.filter(
          e => e.properties.owner === stateUser.user.address
            && e.validity)
      );
    }
  }

  const onLost = () => {
    setPlaying(false);
    setOpenModal(false);
  }

  const onVictory = async (
      type: string,
      typeToken: string,
      data: any) => {
    setPlaying(false);
    setLoader(true);
    setOpenModal(false);
    //setActivity(null);

    // todo refacto
    if (!isNaN(parseInt(type)) && !data) { // mint a type
      setNftUri(hashURI(stateAccount.address, type));
    }
    else if (typeof data === 'object' && data.length > 0) { // cook ice/heat/mix
      if (typeToken === 'mix') { // parents
        // look for recipes
        const recipes = collection.filter((e: Uri) => e.validity && e.image.split('#')[0] === '001000').map((e: Uri) => e.properties.details);
        const details = data.map((e: string) => getObjInArray(collection, 'name', e)).map((e: Uri) => e.image.split('#')[0]).sort();
        const recipePercent = recipeCondition(recipes, details);
        const recipe = getRecipePercent(nameTypeToken, recipePercent);
        setParents(data);
        setNftUri(hashURI(stateAccount.address, recipe.id));
      } else if (type === '002001') { // parents box
        const details = data.map((e: string) => getObjInArray(collection, 'name', e)).map((e: Uri) => e.image.split('#')[0]).sort();
        setParents(data);
        setNftUri(hashURI(stateAccount.address, type));
      } else { // ice or heat
        for (let i = 0; i < data.length; i++) {
          const uriUpdated = await updateUri({ 
            name: data[i],
            action: typeToken,
          });
          if (!uriUpdated) throw new Error("Request Fail");
          dispatchAddUri(uriUpdated);
        }
      }
    }
    else if (typeToken == 'ad' && data) { // manager
      dispatchCreateAd({
        ad: {
          message: data.message,
          addressTo: data.user[0].address,
        }
      });
    }
    setLoader(false);
  }

  const handleInit = () => {
    setNftUri('');
    setPayloadXRPL(null);
    setParents([]);
  }

  const handleTransaction = async (data: any) => {
    try {
      setLoader(true);
      const totalBefore = stateAccount.nfts.length;
      const server = getObjInArray(configOnChain, 'name', stateUser.user.server);
      const nfts = await getTokensXRPL({ server: server.url, address: stateAccount.address });
      if (!nfts) {
        setLoader(false);
        throw new Error("Request Fail");
      }

      const tokenId = nfts[nfts.length - 1].NFTokenID;
      const uri = await registerUri({
        name: xrpl.convertStringToHex(nftUri),
        nftToken: tokenId,
        parents,
      });
      if (!uri) {
        setLoader(false);
        throw new Error("Request Fail");
      }
      dispatchAddUri(uri);
      // reload
      dispatchUser({ address: stateAccount.address });
      // close
      handleInit();
      setLoader(false);
    } catch (error) {
      setLoader(false);
      // console.log({ error });
      return false;
    }
  }

  const launchActivity = (typeToken: string) => {
    const Type = gameMapper[typeToken].e;
    const pocketFull = stateUri.uris.filter(e => e.validity && e.properties.owner === stateAccount.address).length >= stateUser.user.pocket;
    const dayMillisec = 24 * 60 * 60 * 1000;
    const howManyRecipeToday = stateUri.uris.filter(e => e.validity 
        && e.properties.owner === stateAccount.address
        && e.image === '001000'
        && new Date().getTime() - new Date(decodeHashURI(xrpl.convertHexToString(e.name)).date).getTime() < dayMillisec);
    
    if (gameMapper[typeToken].pocketShouldBeAvailable && pocketFull) {
      setActivity(
        <PocketFull
          title={"Pocket Full"}
          message={"You need more space before to play this game"}
        />
      );
    } else if (typeToken === '001000' && howManyRecipeToday.length >= limitGame.recipeCreatedByDay) {
      setActivity(
        <PocketFull
          title={"Recipe Full"}
          message={`You can only create ${limitGame.recipeCreatedByDay} recipe${limitGame.recipeCreatedByDay > 1 ? 's' : ''} every 24 hours.`}
        />
      );
    }
      else {
      setActivity(
        <Type 
          onLaunch={(isPlay: boolean) => setPlaying(isPlay)}
          canPlay={!playing}
          type={typeToken}
          onVictory={(type: string, data: any) => onVictory(type, typeToken, data)}
          onLose={onLost}
          tokenName={nameTypeToken[typeToken] ? nameTypeToken[typeToken].name : 'Unknown'}
          collection={collection}
          users={stateUser.users.results}
        />
      );
    }
    setOpenModal(true);
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
        user={stateUser.user}
        noContainer
        className="backgroundGrey"
      >
      <Web3ProviderXRPL
        handleClose={handleInit}
        visible={!!payloadXRPL}
        handleTransaction={handleTransaction}
        walletType={stateUser.walletType}
        currentJwt={stateUser.jwt}
        payload={payloadXRPL}
        xrplUrl={stateUser.user && stateUser.user.server ? getObjInArray(configOnChain, 'name', stateUser.user.server).url : config.xrpWss}
        //errorMsg={stateUser.errorMsg}
      />

      {helpBox && helpBox.length > 0 &&
        <FaqModal
          shouldInclude={helpBox}
          openDelay={0}
          onClose={() => setHelpBox([])}
        />}

      {stateUser.user && <ActivityDisplay
        width={window.innerWidth}
        height={window.innerHeight - 120}
        type={stateUser.user.type}
        tokenMintable={stateUser.user.tokenBuildable}
        onLaunchActivity={launchActivity}
        loading={stateUser.loadingGetOne || loader}
      >
        <Box
          sx={{ 
            position: 'absolute',
            margin: 'auto',
            top: '10px',
            left: '10px',
            width: window.innerWidth,
          }}
          onClick={() => setHelpBox([10, 16, 17, 18, 19, 20, 21, 22, 23, 24])}>
          <HelpOutlineIcon sx={{ cursor: 'pointer', display: 'block', color: "#1936a6" }} />
        </Box>
      </ActivityDisplay>}

      <Modal
        open={openModal}
        onClose={() => !playing && setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{
            width: '98vw',
            margin: 'auto',
            marginTop: '10px',
            padding: '15px',
            background: 'white',
            color: 'black',
            borderRadius: '5px',
          }}>
          {activity && activity}
          {!activity && <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Something went wrong.
            </Typography>
          </>}
        </Box>
      </Modal>
    </Template>;

  return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(ActivityScene);