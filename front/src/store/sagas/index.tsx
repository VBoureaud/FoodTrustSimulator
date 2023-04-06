import { all } from "redux-saga/effects";

import accountSaga from "./accountSaga";
import userSaga from "./userSaga";
import nftSaga from "./nftSaga";
import uriSaga from "./uriSaga";
import xrplSaga from "./xrplSaga";

export default function* rootSaga() {
  yield all([
    ...accountSaga,
    ...userSaga,
    ...nftSaga,
    ...uriSaga,
    ...xrplSaga,
  ]);
}
