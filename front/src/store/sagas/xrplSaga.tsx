import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";

import {
  subscribe,
} from "../api";

import {
  subscribeXrpl,
  subscribeXrplSuccess,
  subscribeXrplFailure,
} from "../actions";

import {
  TYPES_XRPL,
} from "../types/XrplTypes";

import {
  AppState,
} from "../types";

function* getXrplWorker():any {
  try {
    const res = yield* callApi(subscribe, '');
    console.log({ res });
    yield put(subscribeXrplSuccess({}));
  } catch (error) {
    console.log({ error });
    yield put(subscribeXrplFailure({}));
  }
}

const xrplSaga = [
  takeLatest(TYPES_XRPL.SUBSCRIBE, getXrplWorker),
];

export default xrplSaga;