import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";

import {
  queryUris,
  deleteUri,
} from "../api";

import {
  getUrisSuccess,
  getUrisFailure,
  deleteUriSuccess,
  deleteUriFailure,
  getUser,
} from "../actions";

import {
  TYPES_URI,
} from "../types/UriTypes";

import {
  AppState,
} from "../types";

function* queriesUrisWorker():any {
  try {
    const uris = yield select((state: AppState) => state.uriReducer);
    
    const res = yield* callApi(
      queryUris, {
        name: uris.name, 
        address: uris.address, 
        nftToken: uris.nftToken,
        limit: 100,//todo
      });
    yield put(getUrisSuccess(res.result));
  } catch (error) {
    yield put(getUrisFailure(error));
  }
}

function* deleteUriWorker():any {
  try {
    const uri = yield select((state: AppState) => state.uriReducer);
    const account = yield select((state: AppState) => state.accountReducer);

    const res = yield* callApi(
      deleteUri, {
        name_to_delete: uri.name_to_delete,
        owner: uri.address, 
      });

    // do refresh
    yield put(getUser({ address: account.address }));

    // respect order
    yield put(deleteUriSuccess(res));
  } catch (error) {
    console.log({ error });
    yield put(deleteUriFailure({ name_to_delete: null }));
  }
}

const userSaga = [
  takeLatest(TYPES_URI.GET_URI, queriesUrisWorker),
  takeLatest(TYPES_URI.DELETE, deleteUriWorker),
];

export default userSaga;