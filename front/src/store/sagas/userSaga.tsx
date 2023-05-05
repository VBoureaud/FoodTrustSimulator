import { Store } from 'react-notifications-component';
import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";
import { storageData, getStorage, rmStorage } from "@utils/localStorage";
import store from "@store/index";

import {
  register,
  queryUser,
  patchUser,
  deleteUser,
  getAll,
  getTokensXRPL,
  subscribe,
  subscribeGameServer,
  createAd,
  logoutUser,
} from "../api";

import {
  getTokens,
  getAccount,
  getTx,
  getUris,
  createUserSuccess,
  createUserFailure,
  getAllUsersSuccess,
  getAllUsersFailure,
  deleteUserSuccess,
  deleteUserFailure,
  updateUserSuccess,
  updateUserFailure,
  getUser,
  getUserSuccess,
  getUserFailure,
  getAllUsers,
  createAdFailure,
  createAdSuccess,
  reset,
  getRemoteAccount,
  getRemoteTokens,
  burnOutSuccess,
  burnOutFailure,
} from "../actions";

import {
  TYPES_USER,
} from "../types/UserTypes";

import {
  AppState,
} from "../types";

function* getAllUsersWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    const res = yield* callApi(getAll, { 
      server: stateUser.server,
      usersPage: stateUser.usersPage,
      searchValue: stateUser.searchValue,
      searchType: stateUser.searchType,
    });
    yield put(getAllUsersSuccess(res));
  } catch (error) {
    yield put(getAllUsersFailure(error));
  }
}

function* updateUserWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    
    const res = yield* callApi(patchUser, {
      'quest': stateUser.quest,
      'type': stateUser.type,
      'address': stateUser.user.address,
    });
    
    const newSessionAction = stateUser.user.sessionAction;
    newSessionAction.push('quest');
    res.user.sessionAction = newSessionAction;

    yield put(updateUserSuccess(res));
    yield put(getAllUsers({ 
      server: stateUser.server,
      usersPage: 1
    }));
    if (!stateUser.quest) {
      // go home page after type choosed
      yield put(push("/"));
    }
  } catch (error) {
    yield put(updateUserFailure(error));
  }
}

function* burnOutWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    
    const res = yield* callApi(patchUser, {
      'burnout': new Date().getTime(),
      'type': stateUser.type,
      'image': stateUser.image,
      'address': stateUser.user.address,
    });
    const newSessionAction = stateUser.user.sessionAction;
    newSessionAction.push('burnout_' + stateUser.type);
    res.user.sessionAction = newSessionAction;
    yield put(burnOutSuccess(res));
  } catch (error) {
    yield put(burnOutFailure(error));
  }
}

function* createAdWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    const res = yield* callApi(createAd, {
      'addressFrom': stateUser.user.address,
      ...stateUser.ad,
    });
    const newSessionAction = stateUser.user.sessionAction;
    newSessionAction.push('ad_' + stateUser.ad.addressTo);
    res.user.sessionAction = newSessionAction;
    
    yield put(createAdSuccess(res));
  } catch (error) {
    Store.addNotification({
      //title: "Notification",
      message: error ? error.message : 'Failed to send ad.',
      type: 'danger',
      insert: "bottom",
      container: "bottom-left",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
        click: false,
        touch: false,
      }
    });
    yield put(createAdFailure(error ? error.message : 'Failed to send ad'));
  }
}

function* getUserWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    const stateUri = yield select((state: AppState) => state.uriReducer);
    const addressStorage = yield getStorage('current_account');
    const isSignIn = !!stateUser.user;
    
    // try sign in from storage or try to sign up or just refresh ?
    const address = stateUser.address ? stateUser.address : addressStorage;
    if (!address)
      throw new Error('No address found.')

    let webSocket = stateUser.webSocket;
    const res = yield* callApi(queryUser, {
      address,
      server: stateUser.server,
    });

    const newSessionAction = stateUser.user && stateUser.user.sessionAction ? stateUser.user.sessionAction : [];
    // creation mode
    let data;
    if (!res || !res.user) {
      newSessionAction.push('created');
      data = { user: { address, sessionAction: [] }, webSocket: true };
      data.user['sessionAction'] = newSessionAction;
    }
    else { // signin
      if (newSessionAction.indexOf('signin') === -1) {
        newSessionAction.push('signin');
      }
      res.user['sessionAction'] = newSessionAction;
      data = { ...res, webSocket };
    }

    yield put(getUserSuccess(data));

    // old connect to websocket
    /*if (!isSignIn && !webSocket) {
      yield callApi(
        subscribeGameServer,
        address,
        stateUser.server
        //() => store.dispatch(getUser({ address }))
      );
    }*/

    // lets save
    yield storageData("current_account", address);
    yield storageData("current_server", stateUser.server);
    if (stateUser.walletType)
      yield storageData("current_wallet", stateUser.walletType);
    if (stateUser.jwt)
      yield storageData("current_jwt", stateUser.jwt);

    // account exist
    //if (res && res.user)
    yield put(getAccount({ address }));

    // get info from xrpl
    yield put(getTokens({ address: address }));
    yield put(getTx({ address }));

    yield put(getAllUsers({ server: stateUser.server, usersPage: 1 }));

    // get info from server uris if not delete action in uris
    if (!stateUri.name_to_delete)
      yield put(getUris({ address }));
    
    if (!isSignIn) {
      yield put(push("/profile"));
      Store.addNotification({
        //title: "Notification",
        message: 'Connected to Food Trust Simulator.',
        type: 'default',
        insert: "bottom",
        container: "bottom-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
          pauseOnHover: true,
          click: false,
          touch: false,
        }
      });
    }
  } catch (error) {
    if (error.message)
      yield put(getUserFailure({ errorMsg: error.message }));
    else
      yield put(getUserFailure(error));
    //yield rmStorage("current_account");
    //yield put(push("/"));
  }
}

function* createUserWorker():any {
  try {
    const user = yield select((state: AppState) => state.userReducer);
    // check valide Address
    /*const resTokens = yield* callApi(getTokensXRPL, {
      address: user.address,
    });*/

    // Register on Mongo Server
    const res = yield* callApi(register, {
      name: user.name,
      image: user.image,
      address: user.address,
      type: user.type,
      location: user.location,
      server: user.server,
    });

    const newSessionAction = [];
    newSessionAction.push('register_' + user.address);
    res.user.sessionAction = newSessionAction;

    yield put(createUserSuccess(res));
    yield storageData("current_account", user.address);
    yield put(getTokens({ address: user.address }));
    yield put(getAccount({ address: user.address }));
    yield put(getTx({ address: user.address }));
    yield put(getUris({ address: user.address }));
    yield put(push("/profile"));
  } catch (error) {
    // if error from XRP
    error = error.data ? error.data.error_message : error.message;
    yield put(createUserFailure({
      errorSignUpMsg: error
    }));
    yield rmStorage("current_account");
  }
}

function* logoutWorker():any {
  try {
    const stateUser = yield select((state: AppState) => state.userReducer);
    const server = yield getStorage('current_server');
    yield rmStorage('current_account');
    yield rmStorage('current_wallet');
    yield rmStorage('current_server');
    yield rmStorage('current_jwt');
    yield rmStorage('marketPagination');
    yield rmStorage('marketScroll');

    const res = yield* callApi(logoutUser, {
      address: stateUser.user.address,
      server: server,
    });
    yield put(reset());

    yield put(push("/"));
  } catch (error) {
    //console.log({ error });
  }
}

function* remoteWorker():any {
  try {
    yield put(getRemoteAccount({}));
    yield put(getRemoteTokens({}));
  } catch (error) {
    //console.log({ error });
  }
}

const userSaga = [
  takeLatest(TYPES_USER.CREATE_USER, createUserWorker),
  takeLatest(TYPES_USER.GET_USER, getUserWorker),
  takeLatest(TYPES_USER.UPDATE_USER, updateUserWorker),
  takeLatest(TYPES_USER.GET_ALL, getAllUsersWorker),
  takeLatest(TYPES_USER.CREATE_AD, createAdWorker),
  takeLatest(TYPES_USER.LOGOUT, logoutWorker),
  takeLatest(TYPES_USER.REMOTE_USER, remoteWorker),
  takeLatest(TYPES_USER.BURN_OUT, burnOutWorker),
];

export default userSaga;