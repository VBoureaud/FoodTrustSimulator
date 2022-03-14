import React, { useState, useEffect } from 'react';
import { compose } from "redux";
import { AppState } from "@store/types";
import { getTokens, createUser, logout } from "@store/actions";
import { useDispatch, useSelector } from "react-redux";
import { apiServer } from "@config";

import { hot } from 'react-hot-loader';

import Template from "@components/Template";
import LocationFieldSet from "@components/LocationFieldSet";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from '@mui/material/Alert';

type Props = {};

const LoginScene: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = React.useState(null);
  const dispatchGetTokens = compose(dispatch, getTokens);
  const dispatchRegister = compose(dispatch, createUser);
  const stateAccount = useSelector((state: AppState) => state.accountReducer);
  const stateUser = useSelector((state: AppState) => state.userReducer);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const address = formData.get('account').toString();
    dispatchGetTokens({ address });
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('username').toString();
    const address = formData.get('account').toString();
    let emplacement;
    // Clean LocationFieldSet values
    if (location) {
      emplacement = {
        name: location.name,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
      };
    }
    dispatchRegister({ name, address, location: emplacement });
  };

  return (
    <Template isLogged={false}>
      <Container component="main" maxWidth="xl" sx={{ display: 'flex', mt: 10, mb: 5, justifyContent: 'center' }}>
        <Paper sx={{ background: "white", flex: 1, mr: 5, maxWidth: '380px' }}>
          <Grid item p={5} xs={12} md={12}>
            <Box
              component="form"
              onSubmit={handleSignIn}
              noValidate
              sx={{ mt: 1, maxWidth: '380px' }}
            >
              <Typography sx={{ color: 'black', mb: 1 }} variant="h3">Welcome back</Typography>
              {stateAccount.errorMsg 
                && stateAccount.errorTokens
                && <Alert sx={{ background: '#933727' }} severity="error">{stateAccount.errorMsg}</Alert>}
              <TextField
                sx={{ background: "#222" }}
                margin="normal"
                required
                fullWidth
                id="account"
                label="Account Address"
                name="account"
                autoComplete="account"
                variant="filled"
              />
                {!stateAccount.loadingTokens && (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ height: "52px", mt: 2, mb: 2 }}
                  >
                    Sign In
                  </Button>
                )}
                {stateAccount.loadingTokens && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, mb: 2 }}
                  >
                    <CircularProgress sx={{ color: "white" }} />
                  </Button>
                )}
            </Box>
          </Grid>
        </Paper>

        <Paper sx={{ background: "white", flex: 1, maxWidth: '380px' }}>
          <Grid item p={5} xs={12} md={12}>
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography sx={{ color: 'black', mb: 1 }} variant="h3">Nice to meet you</Typography>
              <a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html">
                <Alert sx={{ background: '#3c5e82' }} severity="info">
                  Generate your <span style={{ fontWeight: 'bold' }}>NFT-Devnet credentials</span> here
                </Alert>
              </a>
              {stateUser.errorSignUpMsg 
                && stateUser.errorCreate
                && <Alert sx={{ mt: 1, background: '#933727' }} severity="error">{stateUser.errorSignUpMsg}</Alert>}
              
              <TextField
                sx={{ background: "#222" }}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="Username"
                variant="filled"
              />
              <TextField
                sx={{ background: "#222" }}
                margin="normal"
                required
                fullWidth
                id="account"
                label="Account Address"
                name="account"
                autoComplete="account"
                variant="filled"
              />
              <LocationFieldSet
                url={apiServer.getCities.url}
                onChange={setLocation}
              />
              {!stateUser.loadingCreate && <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ height: "52px", mt: 2, mb: 2 }}
              >
                Sign Up
              </Button>}
              {stateUser.loadingCreate && (
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2, mb: 2 }}
                >
                  <CircularProgress sx={{ color: "white" }} />
                </Button>
              )}
            </Box>
          </Grid>
        </Paper>

      </Container>

    </Template>
  );
};

export default hot(module)(LoginScene);
