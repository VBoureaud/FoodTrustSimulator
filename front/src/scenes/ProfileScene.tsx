import React, { useState, useEffect } from 'react';
import { compose } from "redux";
import { AppState } from "@store/types";
import { 
  updateUser,
  logout 
} from "@store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom"; 
import { 
  levelDisplay,
  calculNextLevel,
  calculPrevLevel,
  badgeCondition,
  badgeDesc,
} from "@utils/gameEngine";
import { 
  dataGet,
  obj1HaveOrSupObj2,
} from "@utils/helpers";

import { hot } from "react-hot-loader";

import Template from "@components/Template";
import CustomizedProgressBars from "@components/CustomizedProgressBars";
import ProfileChooser, { Profile } from "@components/ProfileChooser";
import './ProfileScene.less';

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";

type ProfileProps = {
  name: string;
  type: string;
};

const listProfiles: ProfileProps[] = [
  {
    name: 'farmer 1',
    type: 'farmer',
  },
  {
    name: 'farmer 2',
    type: 'manager',
  },
  {
    name: 'farmer 3',
    type: 'cook',
  },
]

type Props = {};

const ProfileScene: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);
  const dispatchLogout = compose(dispatch, logout);
  const dispatchUpdate = compose(dispatch, updateUser);
  const [redirctTo, setRedirctTo] = useState(false);
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    if (!stateUser.user) {
      setRedirctTo(true);
    }
    if (stateAccount 
      && stateUser
      && stateUser.user
      && stateAccount.nfts
      && !badges) {
      const data = {
        collection: stateAccount.nfts.length,
        transaction: stateUser.user.transactions,
        pocket: stateUser.user.pocket,
        minted: dataGet(stateAccount, 'account.account_data.MintedTokens'),
        burn: dataGet(stateAccount, 'account.account_data.BurnedTokens'),
      }
      const badgeArr = [];
      const badgeKeys = Object.keys(badgeCondition);
      for (let i = 0; i < badgeKeys.length; i++) {
        if (obj1HaveOrSupObj2(data, badgeCondition[badgeKeys[i]]))
          badgeArr.push(badgeKeys[i]);
      }
      setBadges(badgeArr);
    }
  })

  const updateProfil = (profile: string) => {
    dispatchUpdate({ profile });
  }

  const doProgress = (experience: number) => {
    const next = calculNextLevel(experience);
    const prev = calculPrevLevel(experience);
    const total = (100 * (experience - prev)) / (next - prev);
    return total;
  }

  const render =
    <Template
        isLogged={!!stateAccount.address}
        logout={dispatchLogout}
      >
      
      {stateUser.user 
        && !stateUser.user.profile
        && <Container>
        <Box component="main" maxWidth="xl" sx={{ mb: 4 }}>
          <Typography variant="h2" sx={{ color: 'black', textAlign: 'center' }}>First time ? Please, choose a Profile.</Typography>
        </Box>
        <Box component="main" maxWidth="xl" sx={{ mb: 5 }}>
          <ProfileChooser
            listProfiles={listProfiles}
            onClick={updateProfil}
          />
        </Box>
      </Container>}

      {stateUser.user 
        && stateUser.user.profile
        && <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Profile
            name={stateUser.user.name}
            type={stateUser.user.profile}
            level={stateUser.user.experience > 100 ? levelDisplay(stateUser.user.experience / 100) : 1}
            fullSize
          />
          <Box sx={{ 
            flex: 1,
            p: 5,
            m: 1,
            background: 'white',
            border: '1px solid #dfdddd',
            borderRadius: 5,
            color: 'black',
          }}>

            <Typography sx={{ mt: 2 }}>Next level:</Typography>
            <CustomizedProgressBars 
              progress={doProgress(stateUser.user.experience)}
            />
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, fontSize: '15px' }}>
              {stateUser.user.experience} / {calculNextLevel(stateUser.user.experience)}
            </Typography>

            <Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
              <Typography>Collection:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{stateAccount.nfts && stateAccount.nfts.length}</Typography>
            </Box>

            <Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
              <Typography>Pocket size:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{stateUser.user.pocket}</Typography>
            </Box>

            <Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
              <Typography>Validated offers:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{stateUser.user.transactions}</Typography>
            </Box>

            <Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
              <Typography>Token minted:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{dataGet(stateAccount, 'account.account_data.MintedTokens')}</Typography>
            </Box>

            <Box sx={{ mt: 5, alignItems: 'center', display: 'flex' }}>
              <Typography>Token burned:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{dataGet(stateAccount, 'account.account_data.BurnedTokens')}</Typography>
            </Box>
          
          </Box>
          <Box sx={{ 
            flex: 1,
            p: 3,
            m: 1,
            background: 'white',
            border: '1px solid #dfdddd',
            borderRadius: 5,
            color: 'black',
          }}>
            <Box sx={{ alignItems: 'center', display: 'flex', ml: 2 }}>
              <Typography>Badge Collection:</Typography>
              <Typography sx={{ ml: 1 }} variant='h4'>{(badges ? badges.length : 0) + "/" + Object.keys(badgeDesc).length}</Typography>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
              {badges && badges.map((elt: string, index: number) => 
                <Tooltip key={index} title={badgeDesc[elt]}>
                  <Box className={"badge badge" + elt}>
                  </Box>
                </Tooltip>)}
            </Box>
          </Box>
        </Box>}

    </Template>;

  return redirctTo ? <Redirect to="/" /> : render;
};

export default hot(module)(ProfileScene);
