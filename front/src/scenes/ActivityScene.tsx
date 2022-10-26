import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from "react-hot-loader";
import { profiles, levelDisplay } from "@utils/gameEngine";
import { 
  logout,
  getTokens,
  getAccount,
  getUser,
  addUri,
  updateUser,
} from "@store/actions";

import { 
  mintToken,
  registerUri,
  getTokensXRPL,
} from "@store/api";

import { 
  hashURI,
  unPad,
} from "@utils/helpers";

import { config } from "@config";

import "@utils/TypeToken.less";
import { AppState } from "@store/types";
import Template from "@components/Template";
import XRPLBridge from "@components/XRPLBridge";
import Web3ProviderXRPL from "@components/Web3ProviderXRPL";

import GameAddition from "@components/Game/GameAddition";
import GameTickle from "@components/Game/GameTickle";
import GameConstrain from "@components/Game/GameConstrain";
import GameNoiseWave from "@components/Game/GameNoiseWave";
import GameSubstraction from "@components/Game/GameSubstraction";
import GameBrightness from "@components/Game/GameBrightness";

import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";


type GameMapper = {
  [x: string]: any;
};

const gameMapper: GameMapper = {
  '000001': GameAddition,
  '000002': GameTickle,
  '000003': GameConstrain,
  '000004': GameNoiseWave,
  '000005': GameSubstraction,
  '000006': GameBrightness,
  '000007': GameAddition,
  '000008': GameTickle,
  '000009': GameConstrain,
  '000010': GameNoiseWave,
  '000011': GameSubstraction,
  '000012': GameBrightness,
  '000013': GameAddition,
  '000014': GameTickle,
  '000015': GameConstrain,
  '000016': GameNoiseWave,
  '000017': GameSubstraction,
  '000018': GameBrightness,
  '000019': GameAddition,
  '000020': GameTickle,
  '000021': GameConstrain,
  '000022': GameNoiseWave,
  '000023': GameSubstraction,
  '000024': GameBrightness,
  '000025': GameAddition,
  '000026': GameTickle,
  '000027': GameConstrain,
  '001000': GameNoiseWave,
};

type Props = {};

const snackDialog = {
  'newNft': 'New NFT added to your collection.',
  'badQuest': 'Incomplete quest.',
  'goodQuest': 'Quest complete!',
};

const ActivityScene: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetTokens = compose(dispatch, getTokens);
  const dispatchAccount = compose(dispatch, getAccount);
  const dispatchUser = compose(dispatch, getUser);
  const dispatchUpdateUser = compose(dispatch, updateUser);
  const dispatchAddUri = compose(dispatch, addUri);
  const [redirctTo, setRedirctTo] = useState(false);
  const [nftWinner, setNftWinner] = useState(false);
  const [payloadXRPL, setPayloadXRPL] = useState(null);
  const [msgSnackBar, setMsgSnackBar] = useState(snackDialog.newNft);
  const [openSnack, setOpenSnack] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [nftUri, setNftUri] = useState('');
  const isLimitPocket = stateAccount.nfts && stateUser.user ? stateAccount.nfts.length == stateUser.user.pocket : false;

  useEffect(() => {
    if (!stateUser.user || !stateUser.user.name) {
      setRedirctTo(true);
    }
  })

  // MintNft
  useEffect(() => {
    if (nftWinner && nftUri) {
      const payload = mintToken(
        nftUri
      );
      setPayloadXRPL(payload);
    }
  }, [nftWinner])

  useEffect(() => {
    if (stateUser.quest && !stateUser.loadingUpdate) {
      if (!stateUser.questSuccess && !openSnack) {
        setMsgSnackBar(snackDialog.badQuest);
        setOpenSnack(true);
      } else if (stateUser.questSuccess && !openSnack) {
        setMsgSnackBar(snackDialog.goodQuest);
        setOpenSnack(true);
      }
    }
    return () => {};
  }, [stateUser.loadingUpdate])

  const handleQuest = () => {
    const data = { quest: true };
    setOpenSnack(false);
    dispatchUpdateUser(data);
  }

  const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const actionSnack = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const onVictory = (type: string) => {
    setPlaying(false);
    setNftUri(hashURI(stateAccount.address, type));
    setNftWinner(true);
  }
  const handleInit = () => {
    setNftUri('');
    setNftWinner(false);
    setPayloadXRPL(null);
  }
  const handleTransaction = async (data: any) => {
    try {
      const nfts = await getTokensXRPL({ address: stateAccount.address });
      if (!nfts || !nfts.result || !nfts.result.account_nfts)
        throw new Error("Request Fail");
      const tokenId = nfts.result.account_nfts[nfts.result.account_nfts.length - 1].NFTokenID;
      const uri = await registerUri({ name: nftUri, nftToken: tokenId });
      if (!uri) throw new Error("Request Fail");
    
      setMsgSnackBar(snackDialog.newNft);
      setOpenSnack(true);
      dispatchAddUri(uri);
      // reload
      dispatchGetTokens({ address: stateAccount.address });
      dispatchAccount({ address: stateAccount.address });
      dispatchUser({ address: stateAccount.address });
      // close
      handleInit();
    } catch (error) {
      console.log({ error });
      return false;
    }
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

      <Container sx={{ mb: 5 }}>
        <Alert sx={{ background: '#3c5e82' }} severity="info">
          How it work? <span style={{ fontWeight: 'bold' }}>Play</span> to win new NFT to add in your <span style={{ fontWeight: 'bold' }}>collection</span>.
        </Alert>

        <Box sx={{ flexGrow: 1, mt: 3, mb: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ color: 'black' }} variant="h2">Quest: catch them all !</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {stateUser.user && stateUser.user.tokenNeeded && stateUser.user.tokenNeeded.map((e, index) => 
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      padding: 2,
                      background: '#faf8eb',
                      border: '1px solid #c8c4c4',
                      m: 1,
                      borderRadius: 4,
                    }}>
                      <Box 
                        className={"nftTokenMiddle middleType"+ unPad(e)}
                      ></Box>
                    </Box>
                    {1 + index != stateUser.user.tokenNeeded.length && <Typography sx={{ color: 'black' }} variant="h2">+</Typography>}
                    {1 + index == stateUser.user.tokenNeeded.length && <Typography sx={{ color: 'black' }} variant="h2">=</Typography>}
                    {1 + index == stateUser.user.tokenNeeded.length && 
                      <Box sx={{ 
                        padding: 5,
                        background: '#faf8eb',
                        border: '1px solid #c8c4c4',
                        color: '#333',
                        m: 1,
                        borderRadius: 4,
                        cursor: 'pointer',
                        '&:hover': { color: 'green' },
                      }}
                        onClick={handleQuest}
                      >
                        {!stateUser.loadingUpdate && <BeenhereIcon sx={{ fontSize: 50 }} />}
                        {stateUser.loadingUpdate && <CircularProgress sx={{ fontSize: 40 }} />}
                      </Box>}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {isLimitPocket && 
          <Paper elevation={3} sx={{ mt: 3, padding: 5 }}>
            <Typography variant="h4">
              Pockets full!
            </Typography>
            <Typography variant="h5">
              Earn level to expand your capacities.
            </Typography>
          </Paper>
        }

        {!isLimitPocket && stateUser.user && stateUser.user.tokenBuildable && stateUser.user.tokenBuildable.map((item, key) => {
          const Type = gameMapper[item];
          return <Box key={key} sx={{ flexGrow: 1 }}>
              <Paper elevation={3} sx={{ mt: 3, minHeight: 280, padding: 2 }}>
                <Box sx={{ display: 'flex' }}>
                  <Avatar sx={{ 
                    height: '100px',
                    width: '100px',
                    border: '1px solid black',
                    position: 'relative',
                    right: '30px',
                    bottom: '30px',
                    background: '#faf8eb'
                  }}>
                    <Box 
                      className={"nftTokenMiddle middleType"+ unPad(item)}
                    ></Box>
                  </Avatar>
                  <Typography sx={{ position: 'relative', right: '20px', bottom: '10px', fontSize: '15px' }} variant="h6">PLAY TO WIN IT - COST ESTIMATED 0.00012 XRP</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <Type 
                    onLaunch={() => setPlaying(true)}
                    canPlay={!playing}
                    type={item}
                    onVictory={onVictory}
                  />
                </Box>
              </Paper>
          </Box>})}

        <Snackbar
          open={openSnack}
          sx={{ borderRadius: '4px', border: '4px solid white', background: 'white' }}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message={msgSnackBar}
          action={actionSnack}
        />
      </Container>
    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
}

export default hot(module)(ActivityScene);