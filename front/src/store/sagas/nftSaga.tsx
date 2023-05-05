import { select, takeLatest, put, all } from "redux-saga/effects";
import { push } from "react-router-redux";
import { callApi } from "@utils/helpers";
import { 
  getOffers,
  getParents,
} from "../api";

import {
  getObjInArray
} from '@utils/helpers';

import {
  configOnChain,
} from '@config';

import {
  getOffersSuccess,
  getOffersFailure,
  getParentsSuccess,
  getParentsFailure,
  getUrisSuccess,
} from "../actions";

import {
  TYPES_NFT,
  Parents,
} from "../types/NftTypes";

import {
  Uri,
} from "../types/UriTypes";

import {
  AppState,
} from "../types";

function* getOffersWorker():any {
  try {
    const nftState = yield select((state: AppState) => state.nftReducer);
    const userState = yield select((state: AppState) => state.userReducer);
    const serverObj = getObjInArray(configOnChain, 'name', userState.user.server);
    
    const res = yield getOffers(serverObj.url, nftState.tokenId);
    if (!res) {
      yield put(getOffersFailure({
        errorMsg: 'Connection timeout',
      }));
      return ;
    }
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

function* getParentsWorker():any {
  try {
    const nftState = yield select((state: AppState) => state.nftReducer);
    const res = yield* callApi(
      getParents, {
        name: nftState.name, 
      });
    const parents = res ? res.ancestor : null;
    if (parents && parents.children) {
      // tree to list of array Uri
      const newUris: Uri[] = [];
      const getNode = (current: Parents, newUris: Uri[]) => {
        newUris.push(current.elt.uri);
        current.children.map((c: Parents) => getNode(c, newUris));
      }
      getNode(parents, newUris);
      yield put(getUrisSuccess({ results: newUris }));
    }
    yield put(getParentsSuccess({ parents }));
  } catch (error) {
    yield put(getParentsFailure({}));
  }
}

const nftSaga = [
  takeLatest(TYPES_NFT.GET_OFFERS, getOffersWorker),
  takeLatest(TYPES_NFT.GET_PARENTS, getParentsWorker),
];

export default nftSaga;