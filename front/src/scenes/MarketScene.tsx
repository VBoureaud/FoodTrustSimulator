import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from 'react-hot-loader';
import { History } from 'history';
import { apiServer } from "@config";
import { levelDisplay } from "@utils/gameEngine";

import { 
  logout,
  getAllUsers,
  getRemoteTokens,
  getUris,
} from "@store/actions";

import { AppState } from "@store/types";
import Template from "@components/Template";
import WorldMap from "@components/WorldMap";
import OpenMarket from "@components/OpenMarket";
import SearchField from "@components/SearchField";
import SelectField from "@components/SelectField";
import LocationFieldSet from "@components/LocationFieldSet";

import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from '@mui/icons-material/Search';

import { Profile } from "@components/ProfileCreator";


type Props = {
  history: History
};

const MarketScene: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const stateUri = useSelector((state: AppState) => state.uriReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchGetAllUsers = compose(dispatch, getAllUsers);
  const dispatchRemoteTokens = compose(dispatch, getRemoteTokens);
  const dispatchGetUris = compose(dispatch, getUris);
  const [redirctTo, setRedirctTo] = useState(false);
  const [searchType, setSearchType] = useState('name');

  useEffect(() => {
    if (!stateUser.user || !stateUser.user.name) {
      setRedirctTo(true);
    } else if (!stateUser.users 
      && !stateUser.loadingGetAll
      && !stateUser.errorGetAll) {
      dispatchGetAllUsers({ usersPage: 1 });
    }
  })

  const handleProfileCheck = (address: string) => {
    const user = stateUser.users.results.filter(elt => elt.address == address)[0];

    dispatchRemoteTokens({
      remote_address: address,
      remote_name: user.name,
      remote_profile: user.profile,
    });
    dispatchGetUris({ address });
    props.history.push('/collection/'+ address)
  }

  const render =
    <Template
      noContainer
      isLogged={!!stateAccount.address}
      logout={dispatchLogout}
    >     
      <div style={{ background: '#233044', padding: '20px', minHeight: '300px' }}>
        <Container sx={{ mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Buy offer open:</Typography>
                <OpenMarket
                  uris={stateUri.uris}
                  owner={stateAccount.address}
                />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
      <Container sx={{ mb: 5, mt: 5 }}>
        <Paper elevation={3} sx={{ padding: '5px 20px' }}>
          <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap' }}>
            <Typography variant="h2">Users</Typography>
            <Box sx={{ ml: 3, mt: 2, mb: 1, maxHeight: '120px'}}>
              <SelectField
                onChange={(e: string) => setSearchType(e)}
                options={[ 'name', 'address' ]}
                defaultValue={searchType}
              />
            </Box>
            <Box sx={{ ml: 1, mt: 2, mb: 1, maxHeight: '120px'}}>
              <SearchField 
                onChange={(e: string) => dispatchGetAllUsers({
                  searchType,
                  searchValue: e,
                  usersPage: 1,
                })}
              />
            </Box>
          </Box>
        </Paper>
        {stateUser.loadingGetAll && <CircularProgress sx={{ mt: 2, display: 'block', margin: 'auto', color: "black" }} />}
        {stateUser.errorGetAll && <Typography sx={{ color: 'black', mt: 2 }} variant="h5">Server request fail.</Typography>}
        {stateUser.users && !stateUser.loadingGetAll && !stateUser.errorGetAll && !stateUser.users.results &&
          <Typography sx={{ color: 'black', mt: 2 }} variant="h5">List is empty.</Typography>}
        <Box sx={{ display: 'flex', pt: 5, pb: 5, maxHeight: '490px', overflowX: 'auto' }}>
          {stateUser.users 
            && stateUser.users.results
            && stateUser.users.results.filter(elt => elt.address != stateAccount.address).map((elt, index) => 
              <Profile
                key={index}
                name={elt.name}
                type={elt.profile}
                level={elt.experience ? levelDisplay(elt.experience / 100) : 1}
                location={elt.location && elt.location.name}
                actionText={'Check'}
                onClick={() => handleProfileCheck(elt.address)}
              />)}
        </Box>
      </Container>
      <div style={{ background: '#233044', minHeight: '300px' }}>
        <Container>
          <WorldMap
            markers={
              stateUser.users
              && stateUser.users.results
              && stateUser.users.results.map(elt => ({
                markerOffset: 15,
                name: elt.name,
                coordinates: [ elt.location.lng, elt.location.lat ],
              }))}
          />
        </Container>
      </div>
    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
}

export default hot(module)(MarketScene);