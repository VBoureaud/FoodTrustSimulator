import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";

import {
  queryUris,
} from "../api";

import {
  getUrisSuccess,
  getUrisFailure,
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

const userSaga = [
  takeLatest(TYPES_URI.GET_URI, queriesUrisWorker),
];

export default userSaga;