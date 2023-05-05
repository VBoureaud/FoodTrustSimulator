import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom"; 
import { hot } from 'react-hot-loader';
import { History } from 'history';
import { apiServer } from "@config";
import { levelDisplay } from "@utils/gameEngine";
import { calculateDistance } from "@utils/helpers";

import { 
  logout,
  getAllUsers,
  remoteUser,
  getUris,
} from "@store/actions";
import { 
  User,
} from "@store/types/UserTypes";
import { storageData, getStorage } from "@utils/localStorage";


import { AppState } from "@store/types";
import Template from "@components/Template";
import WorldMap from "@components/WorldMap";
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
import Pagination from '@mui/material/Pagination';

import { PictureCreator } from "@components/Profile";

// Faq Btn
import { FaqModal } from "@components/Faq";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
  const dispatchRemoteUser = compose(dispatch, remoteUser);
  const dispatchGetUris = compose(dispatch, getUris);
  const [redirctTo, setRedirctTo] = useState(false);
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [helpBox, setHelpBox] = useState([]);
  const refScroll: any = useRef();

  // filter on display
  const [coordMap, setCoordMap] = React.useState(null);
  const [zoomMap, setZoomMap] = React.useState(1);
  const [diametreMap, setDiametreMap] = React.useState(300);//radius circle zone

  const handleScroll = useCallback(() => {
    if (refScroll.current)
      if (refScroll.current.scrollTop !== undefined)
        storageData('marketScroll', refScroll.current.scrollTop);
  }, [])

  // Attach the scroll listener to the div
  useEffect(() => {
    if (refScroll.current) refScroll.current.addEventListener("scroll", handleScroll);
  }, [handleScroll])


  useEffect(() => {
    if (!stateUser.user || !stateUser.user.name || !stateUser.user.location) {
      setRedirctTo(true);
    } else if (!stateUser.users 
      && !stateUser.loadingGetAll
      && !stateUser.errorGetAll) {
      handleRefresh();
    }
  });

  useEffect(() => {
    // when page loaded
    handleRefresh();

    // when exit page _ refresh filter
    return () => handleRefresh();

  }, []);

  // when done with getAll
  useEffect(() => {
    if (!stateUser.loadingGetAll) return ;
    const savedPagination = getStorage('marketPagination');
    const savedScroll = getStorage('marketScroll');
    if (savedPagination !== page) {
      setPage(savedPagination);
    }
    if (refScroll.current) refScroll.current.scrollTo(0, savedScroll);
  }, [stateUser.loadingGetAll]);

  const handleRefresh = () => {
    dispatchGetAllUsers({
      searchValue: '',
      server: stateUser.server,
      usersPage: 1,
    });
  }

  const handleProfileCheck = (user: User) => {
    dispatchRemoteUser({ userRemote: user });
    dispatchGetUris({ address: user.address });
    window.scrollTo(0, 0);
    props.history.push('/collection/'+ user.address)
  }

  const handlePagination = (event: React.ChangeEvent<unknown> | null, value: number) => {
    setPage(value - 1);
    storageData('marketPagination', value - 1);
    storageData('marketScroll', 0);
    if (refScroll.current) refScroll.current.scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  const handleFilterGeographic = (marker: string[], coord: number[], zoom: number, diametre: number) => {
    if (coord === null) return true;
    const dist = calculateDistance([parseFloat(marker[0]), parseFloat(marker[1])], coordMap, diametre);
    if (dist > diametre / 3) return false;// todo affinate
    return true;
  }

  const render =
    <Template
      noContainer
      isLogged={!!stateAccount.address}
      logout={dispatchLogout}
      user={stateUser.user}
    >
      {stateUser.user && stateUser.user.location && <div style={{ 
        marginBottom: '10px',
        background: '#233044',
        minHeight: '300px',
        display: 'flex',
        flexWrap: 'wrap',
        overflowX: 'hidden',
        /*maxHeight: '712px',*/ }}>
        {/* Map */}
        <div style={{ 
          maxHeight: 'calc(100vh - 70px)',
          minWidth: '600px',
          overflow: 'hidden',
          position: 'relative',
          flex: 2 }}>
          <Container>
            {helpBox && helpBox.length > 0 &&
              <FaqModal
                shouldInclude={helpBox}
                openDelay={0}
                onClose={() => setHelpBox([])}
              />}

            <Box
              sx={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                zIndex: 2,
              }}
              onClick={() => setHelpBox([40])}>
              <HelpOutlineIcon sx={{ 
                cursor: 'pointer',
                display: 'block',
                color: "#a6b3e3",
                background: '#3c3c88',
                borderRadius: '30px',
              }} />
            </Box>

            <WorldMap
              initCenter={stateUser.user && [stateUser.user.location.lng, stateUser.user.location.lat]}
              onZoomOrMove={
                (coordinates: number[], zoom: number) => {
                  setCoordMap(coordinates);
                  setZoomMap(zoom);
                }
              }
              handleClick={(name: string) => {
                  setSearchType('name');
                  setSearchValue(name);
                  handlePagination(null, 1);
                  dispatchGetAllUsers({
                    server: stateUser.server,
                    searchType: 'name',
                    searchValue: name,
                    usersPage: 1,
                  });
              }}
              circleMarker
              markers={
                stateUser.users
                && stateUser.users.results
                && stateUser.users.results
                /*.filter(elt => 
                  handleFilterGeographic([elt.location.lng, elt.location.lat], coordMap, zoomMap, diametreMap / zoomMap)
                  || elt.name == searchValue
                )*/
                .map(elt => ({
                  markerOffset: 15,
                  name: elt.name,
                  coordinates: [ elt.location.lng, elt.location.lat ],
                }))
              }
            />

            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              position: 'absolute',
              alignItems: { xs: 'baseline', md: 'center' },
              flexDirection: { xs: 'column', md: 'row' },
              bottom: { xs: '15px', md: '15px' },
              left: { xs: '15px', md: '0' },
              right: 0,
              zIndex: 2,
            }}>
              <Box sx={{ maxHeight: '120px', mr: 1, mb: { xs: 1, md: 0 } }}>
                <SelectField
                  onChange={(e: string) => setSearchType(e)}
                  options={[ 'name', 'address' ]}
                  value={searchType}
                />
              </Box>
              <Box sx={{ mr: 0, maxHeight: '120px'}}>
                <SearchField 
                  loading={stateUser.loadingGetAll}
                  value={searchValue}
                  onDelete={() => {
                      if (searchValue) {
                        setSearchValue('');
                        handlePagination(null, 1);
                        dispatchGetAllUsers({
                          server: stateUser.server,
                          searchType,
                          searchValue: '',
                          usersPage: 1,
                        });
                      }
                    }
                  }
                  onChange={(e: string) => {
                      setSearchValue(e);
                      if (e)
                        handlePagination(null, 1);
                      
                      dispatchGetAllUsers({
                        server: stateUser.server,
                        searchType,
                        searchValue: e,
                        usersPage: 1,
                      })
                    }
                  }
                />
              </Box>
            </Box>
          </Container>
        </div>
        {/* List User */}
        <div style={{ minWidth: '300px', flex: 1, background: '#344052', marginTop: '1px' }}>
          <Typography sx={{ mt: 1, p: '5px 15px' }} variant="h5">
            User{stateUser.users && stateUser.users.results && stateUser.users.results.length > 1 ? 's' : ''}
            <span style={{ marginLeft: '7px' }}>{stateUser.users && stateUser.users.results && stateUser.users.results.length}</span>
            {stateUser.loadingGetAll && <CircularProgress size={18} sx={{ ml: 1, color: "yellow" }} />}
          </Typography>
          {stateUser.errorGetAll && <Typography sx={{ color: 'tomato', mt: 2, p: 1 }} variant="h6">Server request fail, please try again later.</Typography>}
          {stateUser.users && !stateUser.loadingGetAll && !stateUser.errorGetAll && (!stateUser.users.results || !stateUser.users.results.length) &&
            <Container>
              <Typography sx={{ 
                color: 'white',
                mt: 2,
                background: '#262626',
                padding: '5px',
                borderRadius: '5px',
                textAlign: 'center',
              }} variant="h5">List is empty.</Typography>
            </Container>}

          <Box 
            ref={refScroll}
            sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              flexDirection: 'row',
              pb: 5,
              overflow: 'auto',
              overflowX: 'hidden',
              maxHeight: 'calc(100vh - 180px)'
            }}
          >
            {stateUser.users 
              && stateUser.users.results
              && stateUser.users.results/*.filter(elt => elt.address != stateAccount.address)*/
              //.filter(elt => handleFilterGeographic([elt.location.lng, elt.location.lat], coordMap, zoomMap, diametreMap / zoomMap))
              .filter((elt: User, num: number) => num >= page * pageSize && num < (page + 1) * pageSize)
              .map((elt, index) => 
                <div key={index} style={{ width: '373px', height: '323px', transform: 'scale(0.8)', margin: '5px' }}>
                  <PictureCreator
                    cropSize
                    mode={0}
                    imageDisplay={elt.image}
                    level={elt.experience ? levelDisplay(elt.experience) : 1}
                    type={elt.type}
                    name={elt.name}
                    location={elt.location.name}
                    onClick={() => handleProfileCheck(elt)}
                    actionText={'Check'}
                  />
                </div>)}
          </Box>
          {/* Pagination */}
          {stateUser.users.results && stateUser.users.results.length / pageSize > 1 && <Pagination
            count={Math.ceil(stateUser.users.results.length / pageSize)}
            page={page + 1}
            sx={{ 
              background: '#202b3c',
              display: 'flex',
              justifyContent: 'center',
              padding: '10px',
              borderRadius: '7px',
              maxWidth: '300px',
              margin: 'auto',
              mt: 1,
              mb: 1,
            }}
            onChange={handlePagination}
          />}
        </div>
      </div>}
    </Template>;

  return redirctTo ? <Redirect to="/profile" /> : render;
}

export default hot(module)(MarketScene);