import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";
import { storageData, getStorage, rmStorage } from "@utils/localStorage";
import { 
  getTokensXRPL,
  accountInfoXRPL,
  accountTransactionXRPL,
} from "../api";

import {
  getAccount,
  getAccountSuccess,
  getAccountFailure,
  getTx,
  getTxSuccess,
  getTxFailure,
  getTokens,
  getTokensSuccess,
  getTokensFailure,
  doRefreshSuccess,
  doRefreshFailure,
  getRemoteTokensSuccess,
  getRemoteTokensFailure,
  getUser,
  getUris,
} from "../actions";

import {
  TYPES_ACCOUNT,
} from "../types/AccountTypes";

import {
  AppState,
} from "../types";

function* getAccountWorker():any {
  try {
    const account = yield select((state: AppState) => state.accountReducer);
    const res = yield* callApi(accountInfoXRPL, {
      address: account.address,
    });
    yield put(getAccountSuccess({ account: res.result }));
  } catch (error) {
    yield put(getAccountFailure({
      errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
    yield rmStorage("current_account");
  }
}

function* getTxWorker():any {
  try {
    const account = yield select((state: AppState) => state.accountReducer);
    const res = yield* callApi(accountTransactionXRPL, {
      address: account.address,
    });
    yield put(getTxSuccess({ transactions: res.result ? res.result.transactions : [] }));
  } catch (error) {
    //console.log({ error });
    yield put(getTxFailure({
      errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
  }
}

function* refreshWorker():any {
  try {
    const address = yield getStorage('current_account');
    if (!address) {
      yield put(doRefreshFailure());
      return false;
    }
    const walletType = yield getStorage('current_wallet');
    const currentJwt = yield getStorage('current_jwt');

    yield put(doRefreshSuccess({ address }));
    yield put(getAccount({ address }));
    yield put(getUser({ address, walletType, jwt: currentJwt }));
    //yield put(getTokens({ address }));
    //yield put(getTx({ address }));
    //yield put(getUris({ address }));
  } catch (error) {
    yield put(doRefreshFailure());
    yield rmStorage('current_account');
    yield rmStorage('current_jwt');
    yield put(push('login')); // Redirect Login
  }
}

// Option For Sign In
function* getTokensWorker():any {
  try {
    const account = yield select((state: AppState) => state.accountReducer);
    const res = yield* callApi(getTokensXRPL, {
      address: account.address,
    });
    yield put(getTokensSuccess({ nfts: res.result.account_nfts ? res.result.account_nfts : [] }));

    // if sign in - todo rm ?
    /*const address = yield getStorage('current_account');
    if (!address) { // new Connection
      yield storageData("current_account", account.address);
      yield put(push("/"));
      yield put(getAccount({ address: account.address }));
      yield put(getUser({ address: account.address }));
      yield put(getTx({ address: account.address }));
      yield put(getUris({ address: account.address }));
    }*/
  } catch (error) {
    yield put(getTokensFailure({
      errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
    yield rmStorage("current_account");
  }
}

function* getRemoteTokensWorker():any {
  try {
    const account = yield select((state: AppState) => state.accountReducer);
    let remote_nfts = null;
    if (account.remote_address) {
      const res = yield* callApi(getTokensXRPL, {
        address: account.remote_address,
      });
      remote_nfts = res.result.account_nfts;
    }
    yield put(getRemoteTokensSuccess({ remote_nfts }));
  } catch (error) {
    yield put(getRemoteTokensFailure({
      remote_errorMsg: error.data.error_message
    }));
  }
}

function* logoutWorker():any {
  yield rmStorage('current_account');
  yield rmStorage('current_wallet');
  yield rmStorage('current_jwt');
  yield put(push("/"));
}

const accountSaga = [
  takeLatest(TYPES_ACCOUNT.GET_ACCOUNT, getAccountWorker),
  takeLatest(TYPES_ACCOUNT.GET_TX, getTxWorker),
  takeLatest(TYPES_ACCOUNT.GET_TOKENS, getTokensWorker),
  takeLatest(TYPES_ACCOUNT.GET_REMOTE_TOKENS, getRemoteTokensWorker),
  takeLatest(TYPES_ACCOUNT.REFRESH, refreshWorker),
  takeLatest(TYPES_ACCOUNT.LOGOUT, logoutWorker),
];

export default accountSaga;