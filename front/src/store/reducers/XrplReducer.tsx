import {
  TYPES_XRPL,
  XrplReducerState,
  SubscribeXrplPayload,
  SubscribeXrplSuccessPayload,
  SubscribeXrplFailurePayload,
} from "../types/XrplTypes";

import { createReducer } from "@utils/helpers";

const defaultState: XrplReducerState = {
  loading: false,
  error: false,
};

export const xrplReducer = createReducer(
  {
    [TYPES_XRPL.SUBSCRIBE]: (state: XrplReducerState, payload: SubscribeXrplPayload) => ({
      ...state,
      ...payload,
      loading: true,
      error: false,
    }),
    [TYPES_XRPL.SUBSCRIBE_SUCCESS]: (state: XrplReducerState, payload: SubscribeXrplSuccessPayload) => ({
      ...state,
      ...payload,
      loading: false,
      error: false,
    }),
    [TYPES_XRPL.SUBSCRIBE_FAILURE]: (state: XrplReducerState, payload: SubscribeXrplFailurePayload) => ({
      ...state,
      ...payload,
      loading: false,
      error: true,
    }),
  },
  defaultState
);
