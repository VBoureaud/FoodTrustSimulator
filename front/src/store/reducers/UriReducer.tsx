import {
  TYPES_URI,
  UriReducerState,
  GetUrisPayload,
  UrisPayload,
  GetUrisFailurePayload,
  DeleteUriPayload,
  DeleteUriSuccessPayload,
  DeleteUriFailurePayload,
  AddUriPayload,
  Uri,
} from "../types/UriTypes";

import {
  TYPES_USER,
} from "../types/UserTypes";

import { createReducer, updateArrayOfObjectByRef } from "@utils/helpers";

const defaultState: UriReducerState = {
  uris: null,
  address: null,
  name: null,
  name_to_delete: null,
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
    [TYPES_URI.DELETE]: (state: UriReducerState, payload: DeleteUriPayload) => ({
      ...state,
      ...payload,
      loading: true,
      error: false,
    }),
    [TYPES_URI.DELETE_SUCCESS]: (state: UriReducerState, payload: DeleteUriSuccessPayload) => {
      const currentUris = state.uris ? state.uris : [];
      const uri = payload.uri ? [ payload.uri ] : [];
      const updated = updateArrayOfObjectByRef(currentUris, uri, 'name');
      
      return ({
        ...state,
        uris: updated,
        name_to_delete: '',
        loading: false,
        error: false,
      });
    },
    [TYPES_URI.DELETE_FAILURE]: (state: UriReducerState, payload: DeleteUriFailurePayload) => ({
      ...state,
      ...payload,
      loading: false,
      error: true,
    }),

    // reset
    [TYPES_USER.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);