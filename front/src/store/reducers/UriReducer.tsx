import {
  TYPES_URI,
  UriReducerState,
  GetUrisPayload,
  UrisPayload,
  GetUrisFailurePayload,
  AddUriPayload,
  Uri,
} from "../types/UriTypes";

import {
  TYPES_ACCOUNT,
} from "../types/AccountTypes";

import { createReducer, updateArrayOfObjectByRef } from "@utils/helpers";

const defaultState: UriReducerState = {
  uris: null,
  address: null,
  name: null,
  nftToken: null,
  loading: false,
  error: false,
}

export const uriReducer = createReducer(
  {
    [TYPES_URI.GET_URI]: (state: UriReducerState, payload: GetUrisPayload) => ({
      ...state,
      ...payload,
      loading: true,
      error: false,
    }),
    [TYPES_URI.GET_URI_SUCCESS]: (state: UriReducerState, payload: UrisPayload) => {
      const currentUris = state.uris ? state.uris : [];
      const newUris = payload.results ? payload.results : [];
      return ({
        ...state,
        uris: updateArrayOfObjectByRef(currentUris, newUris, 'name'),
        loading: false,
        error: false,
      });
    },
    [TYPES_URI.GET_URI_FAILURE]: (state: UriReducerState, payload: GetUrisFailurePayload) => ({
      ...state,
      ...payload,
      loading: false,
      error: true,
    }),
    [TYPES_URI.ADD]: (state: UriReducerState, payload: AddUriPayload) => {
      const currentUris = state.uris ? state.uris : [];
      const newUris = payload.uri ? [ payload.uri ] : [];
      const updated = updateArrayOfObjectByRef(currentUris, newUris, 'name');
      return ({
        ...state,
        uris: updated,
      });
    },

    [TYPES_ACCOUNT.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);