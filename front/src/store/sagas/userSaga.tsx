import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";
import { storageData, getStorage, rmStorage } from "@utils/localStorage";

import {
  register,
  getUser,
  patchUser,
  deleteUser,
  getAll,
  getTokensXRPL,
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
  getUserSuccess,
  getUserFailure,
} from "../actions";

import {
  TYPES_USER
} from "../types/UserTypes";

function* getAllUsersWorker():any {
  try {
    const userState = yield select((state) => state.userReducer);
    const res = yield* callApi(getAll, { 
      usersPage: userState.usersPage,
      searchValue: userState.searchValue,
      searchType: userState.searchType,
    });
    yield put(getAllUsersSuccess(res));
  } catch (error) {
    yield put(getAllUsersFailure(error));
  }
}

function* updateUserWorker():any {
  try {
    const stateUser = yield select((state) => state.userReducer);
    
    const res = yield* callApi(patchUser, {
      'quest': stateUser.quest,
      'profile': stateUser.profile,
      'address': stateUser.user.address,
    });
    yield put(updateUserSuccess(res));
    if (!stateUser.quest) {
      // go home page after profile choosed
      yield put(push("/"));
    }
  } catch (error) {
    yield put(updateUserFailure(error));
  }
}

function* getUserWorker():any {
  try {
    const address = yield getStorage('current_account');
    if (!address)
      return false;

    const res = yield* callApi(getUser, {
      address
    });
    yield put(getUserSuccess(res));
  } catch (error) {
    yield put(getUserFailure(error));
    yield rmStorage("current_account");
  }
}

function* createUserWorker():any {
  try {
    const user = yield select((state) => state.userReducer);
    
    // check valide Address
    const resTokens = yield* callApi(getTokensXRPL, {
      address: user.address,
    });

    // Register on Mongo Server
    const res = yield* callApi(register, {
      name: user.name,
      address: user.address,
      location: user.location,
    });

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

const userSaga = [
  takeLatest(TYPES_USER.CREATE_USER, createUserWorker),
  takeLatest(TYPES_USER.GET_USER, getUserWorker),
  takeLatest(TYPES_USER.UPDATE_USER, updateUserWorker),
  takeLatest(TYPES_USER.GET_ALL, getAllUsersWorker),
];

export default userSaga;