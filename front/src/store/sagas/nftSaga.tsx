import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";
import { storageData, getStorage, rmStorage } from "@utils/localStorage";
import { 
  getOffers,
  getHistory,
} from "../api";

import {
  getOffersSuccess,
  getOffersFailure,
  getHistorySuccess,
  getHistoryFailure,
} from "../actions";

import {
  TYPES_NFT
} from "../types/NftTypes";

function* getOffersWorker():any {
  try {
    const nft = yield select((state) => state.nftReducer);
    const res = yield getOffers(nft.tokenId);
    yield put(getOffersSuccess({ 
      buyOffers: res.nftBuyOffers, 
      sellOffers: res.nftSellOffers, 
    }));
  } catch (error) {
    yield put(getOffersFailure({
      errorMsg: error.data ? error.data.error_message : error
    }));
  }
}

function* getHistoryWorker():any {
  try {
    const nft = yield select((state) => state.nftReducer);
    const res = yield* callApi(getHistory, {
      tokenId: nft.tokenId,
    });
    yield put(getHistorySuccess(res));
  } catch (error) {
    yield put(getHistoryFailure(error));
  }
}

const nftSaga = [
  takeLatest(TYPES_NFT.GET_OFFERS, getOffersWorker),
  takeLatest(TYPES_NFT.GET_HISTORY, getHistoryWorker),
];

export default nftSaga;