import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

import { 
  AppState,
} from "@store/types";
import { 
  AccountData,
  Nfts,
  Transactions,
} from "@store/types/AccountTypes";

import { 
  doRefresh,
  getTx,
  logout,
} from "@store/actions";
import { useSelector } from "react-redux";

import DashBoard from "@components/DashBoard";
import DataGridTx from "@components/DataGridTx";
import NoLoginContent from "@components/NoLoginContent";
import Template from "@components/Template";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  refreshDispatch: Function;
  logoutDispatch: Function;
  address: string;
  name: string;
  profile: string;
  pocket: number;
  account_data: AccountData;
  nfts?: Nfts[];
  transactions?: Transactions[];
  loadingAccount: boolean;
  loadingTokens: boolean;
  loadingTx: boolean;
}
interface State {
  refreshed: boolean;
}

class HomeScene extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshed: false,
    };
  }

  componentDidMount() {
    if (!this.state.refreshed && !this.props.address) {
      this.props.refreshDispatch();
    }
  }

  render() {
    return (
      <React.Fragment>
        {!this.props.address && <NoLoginContent />}
        {this.props.address && 
          <Template
            isLogged={!!this.props.address}
            logout={this.props.logoutDispatch}
          >
            {(this.props.loadingAccount || this.props.loadingTokens) && <CircularProgress sx={{ display: 'block', margin: 'auto', color: "white" }} />}
            <Container sx={{ mb: 5 }}>
              <Alert sx={{ mb: 1, background: '#3c5e82' }} severity="info">
                This is your public account, for every action on <span style={{ fontWeight: 'bold' }}>XRPLedger</span> we will ask your <span style={{ fontWeight: 'bold' }}>credentials</span> because we <span style={{ fontWeight: 'bold' }}>never</span> save it.
              </Alert>
              <DashBoard 
                loading={this.props.loadingAccount || this.props.loadingTokens}
                name={this.props.name}
                profile={this.props.profile}
                address={this.props.address}
                balance={this.props.account_data ? this.props.account_data.Balance : ''}
                nftsLength={this.props.nfts ? this.props.nfts.length : 0}
                nftsLimit={this.props.pocket}
              />
              <Paper elevation={3} sx={{ mt: 2, minHeight: 250, padding: 4 }}>
                <DataGridTx
                  loading={this.props.loadingTx}
                  transactions={this.props.transactions}
                  ownerAddr={this.props.address}
                  ownerName={this.props.name}
                />
              </Paper>
            </Container>
          </Template>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  name: state.userReducer.user && state.userReducer.user.name,
  profile: state.userReducer.user && state.userReducer.user.profile,
  pocket: state.userReducer.user && state.userReducer.user.pocket,
  address: state.accountReducer.address,
  account_data: state.accountReducer.account && state.accountReducer.account.account_data,
  nfts: state.accountReducer.nfts,
  loadingAccount: state.accountReducer.loadingAccount,
  loadingTokens: state.accountReducer.loadingTokens,
  loadingTx: state.accountReducer.loadingTx,
  transactions: state.accountReducer.transactions,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  refreshDispatch: compose(dispatch, doRefresh),
  getTxDispatch: compose(dispatch, getTx),
  logoutDispatch: compose(dispatch, logout),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
)(HomeScene);
