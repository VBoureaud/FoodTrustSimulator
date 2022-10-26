import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { RouteComponentProps, Redirect, useHistory } from "react-router-dom";
import { hot } from 'react-hot-loader';
//import { History } from 'history';

import { 
  logout,
  getTokens,
  getAccount,
  getRemoteTokens,
  resetRemoteTokens,
} from "@store/actions";

import { 
  burnToken
} from "@store/api";

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { AppState } from "@store/types";
import Template from "@components/Template";
import ListNfts from "@components/ListNfts";

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
  const dispatchRemoteTokens = compose(dispatch, getRemoteTokens);
  const dispatchResetRemote = compose(dispatch, resetRemoteTokens);
  const [redirctTo, setRedirctTo] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!stateUser.user) {
      setRedirctTo(true);
    }
  })

  const handleBack = () => {
    history.goBack();
    dispatchResetRemote();
  }

  const buildDialogText = (tokenId: string) => {
    return <span style={{ wordBreak: 'break-word' }}>Do you confirm the deletion of TokenId <strong>{tokenId}</strong> ?</span>
  }


  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
      >
      <Container sx={{ mb: 5, color: 'black' }}>
        {!props.match.params.id && <Typography variant="h2">Your Collection</Typography>}
        
        {(stateAccount.loadingRemoteTokens || stateAccount.loadingTokens || stateUri.loading)
          && <Box sx={{ p: 5 }}>
          <CircularProgress sx={{ display: 'block', margin: 'auto', color: "black" }} />
        </Box>}

        {!props.match.params.id 
          && !stateAccount.loadingTokens 
          && !stateUri.loading
          && <ListNfts
          address={stateAccount.address}
          nfts={stateAccount.nfts}
          uris={stateUri.uris}
        />}
        {props.match.params.id && !stateAccount.loadingRemoteTokens && <Button onClick={handleBack} sx={{ m: 2, color:'black' }} startIcon={<ArrowBackIosIcon />}>Back</Button>}
        {props.match.params.id && !stateAccount.loadingRemoteTokens && <Typography variant="h2">{stateAccount.remote_name}'s Collection</Typography>}
        {props.match.params.id && !stateAccount.loadingRemoteTokens && <ListNfts
          address={stateAccount.address}
          nfts={stateAccount.remote_nfts}
          uris={stateUri.uris}
        />}
      </Container>
    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
}

export default hot(module)(CollectionScene);