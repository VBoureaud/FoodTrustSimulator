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
  configOnChain,
} from "@config";
import {
  getObjInArray,
} from "@utils/helpers";

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
  getRemoteAccountSuccess,
  getRemoteAccountFailure,
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
    const accountState = yield select((state: AppState) => state.accountReducer);
    const userState = yield select((state: AppState) => state.userReducer);
    const server = getObjInArray(configOnChain, 'name', userState.server);

    const res = yield* callApi(accountInfoXRPL, {
      address: accountState.address,
      server: server.url,
    });
    yield put(getAccountSuccess({ account: res && res.result ? res.result : null }));
  } catch (error) {
    yield put(getAccountFailure({
      errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
    yield rmStorage('current_account');
    yield rmStorage('current_server');
    yield rmStorage('current_jwt');
    yield rmStorage('marketPagination');
    yield rmStorage('marketScroll');
    yield put(push('/')); // Redirect Login
  }
}

function* getTxWorker():any {
  try {
    const accountState = yield select((state: AppState) => state.accountReducer);
    const userState = yield select((state: AppState) => state.userReducer);
    const server = getObjInArray(configOnChain, 'name', userState.server);
    const res = yield* callApi(accountTransactionXRPL, {
      server: server.url,
      address: accountState.address,
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
    const server = yield getStorage('current_server');
    const walletType = yield getStorage('current_wallet');
    const currentJwt = yield getStorage('current_jwt');

    yield put(doRefreshSuccess({ address }));
    yield put(getUser({ address, walletType, jwt: currentJwt, server }));
  } catch (error) {
    yield put(doRefreshFailure());
    yield rmStorage('current_account');
    yield rmStorage('current_server');
    yield rmStorage('current_jwt');
    yield rmStorage('marketPagination');
    yield rmStorage('marketScroll');
    yield put(push('/')); // Redirect Login
  }
}

function* getTokensWorker():any {
  try {
    const accountState = yield select((state: AppState) => state.accountReducer);
    const userState = yield select((state: AppState) => state.userReducer);
    const server = getObjInArray(configOnChain, 'name', userState.server);
    
    const res = yield* callApi(getTokensXRPL, {
      server: server.url,
      address: accountState.address,
    });
    yield put(getTokensSuccess({ nfts: res ? res : [] }));
  } catch (error) {
    yield put(getTokensFailure({
      errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
  }
}

function* getRemoteAccountWorker():any {
  try {
    const userState = yield select((state: AppState) => state.userReducer);
    let remote_account = null;
    const server = getObjInArray(configOnChain, 'name', userState.userRemote.server);

    if (userState.userRemote) {
      const res = yield* callApi(accountInfoXRPL, {
        address: userState.userRemote.address,
        server: server.url,
      });
      remote_account = res;
    }

    yield put(getRemoteAccountSuccess({ remote_account: remote_account && remote_account.result ? remote_account.result : null }));
  } catch (error) {
    yield put(getRemoteAccountFailure({
      remote_errorMsg: error.data && error.data.error_message ? error.data.error_message : error
    }));
  }
}

function* getRemoteTokensWorker():any {
  try {
    const userState = yield select((state: AppState) => state.userReducer);
    let remote_nfts = null;
    const server = getObjInArray(configOnChain, 'name', userState.userRemote.server);

    if (userState.userRemote) {
      const res = yield* callApi(getTokensXRPL, {
        address: userState.userRemote.address,
        server: server.url,
      });
      remote_nfts = res;
    }
    yield put(getRemoteTokensSuccess({ remote_nfts }));
  } catch (error) {
    yield put(getRemoteTokensFailure({
      remote_errorMsg: error.data.error_message
    }));
  }
}

const accountSaga = [
  takeLatest(TYPES_ACCOUNT.GET_ACCOUNT, getAccountWorker),
  takeLatest(TYPES_ACCOUNT.GET_TX, getTxWorker),
  takeLatest(TYPES_ACCOUNT.GET_TOKENS, getTokensWorker),
  takeLatest(TYPES_ACCOUNT.GET_REMOTE_ACCOUNT, getRemoteAccountWorker),
  takeLatest(TYPES_ACCOUNT.GET_REMOTE_TOKENS, getRemoteTokensWorker),
  takeLatest(TYPES_ACCOUNT.REFRESH, refreshWorker),
];

export default accountSaga;