import {
  TYPES_ACCOUNT,
  AccountReducerState,
  GetAccountPayload,
  AccountPayload,
  TransactionsPayload,
  AccountFailurePayload,
  GetTokensPayload,
  TokensPayload,
  TokensFailurePayload,
  GetRemoteAccountPayload,
  RemoteAccountPayload,
  RemoteAccountFailurePayload,
  GetRemoteTokensPayload,
  RemoteTokensPayload,
  RemoteTokensFailurePayload,
  ResetRemotePayload,
} from "../types/AccountTypes";

import {
  TYPES_USER,
  UserPayload,
} from "../types/UserTypes";

import { createReducer } from "@utils/helpers";

const defaultState: AccountReducerState = {
  address: '',
  errorMsg: '',
  errorSignUpMsg: '',
  account: null,
  nfts: null,
  remote_account: null,
  remote_nfts: null,
  remote_errorMsg: '',
  transactions: null,
  loadingAccount: false,
  errorAccount: false,
  loadingTokens: false,
  errorTokens: false,
  loadingRefresh: false,
  errorRefresh: false,
  errorRemoteAccount: false,
  loadingRemoteAccount: false,
  errorRemoteTokens: false,
  loadingRemoteTokens: false,
  errorTx: false,
  loadingTx: false,
};

export const accountReducer = createReducer(
  {
    [TYPES_ACCOUNT.REFRESH]: (state: AccountReducerState, payload: GetAccountPayload) => ({
      ...state,
      ...payload,
      loadingRefresh: true,
      errorRefresh: false,
    }),
    [TYPES_ACCOUNT.REFRESH_SUCCESS]: (state: AccountReducerState, payload: AccountPayload) => ({
      ...state,
      ...payload,
      loadingRefresh: false,
      errorRefresh: false,
    }),
    [TYPES_ACCOUNT.REFRESH_FAILURE]: (state: AccountReducerState, payload: AccountFailurePayload) => ({
      ...state,
      ...payload,
      loadingRefresh: false,
      errorRefresh: true,
    }),
    [TYPES_ACCOUNT.GET_ACCOUNT]: (state: AccountReducerState, payload: GetAccountPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingAccount: true,
      errorAccount: false,
    }),
    [TYPES_ACCOUNT.GET_ACCOUNT_SUCCESS]: (state: AccountReducerState, payload: AccountPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingAccount: false,
      errorAccount: false,
    }),
    [TYPES_ACCOUNT.GET_ACCOUNT_FAILURE]: (state: AccountReducerState, payload: AccountFailurePayload) => ({
      ...state,
      ...payload,
      address: '',
      loadingAccount: false,
      errorAccount: true,
    }),
    [TYPES_ACCOUNT.GET_TX]: (state: AccountReducerState, payload: GetAccountPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingTx: true,
      errorTx: false,
    }),
    [TYPES_ACCOUNT.GET_TX_SUCCESS]: (state: AccountReducerState, payload: TransactionsPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingTx: false,
      errorTx: false,
    }),
    [TYPES_ACCOUNT.GET_TX_FAILURE]: (state: AccountReducerState, payload: AccountFailurePayload) => ({
      ...state,
      ...payload,
      loadingTx: false,
      errorTx: true,
    }),
    [TYPES_ACCOUNT.GET_TOKENS]: (state: AccountReducerState, payload: GetTokensPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingTokens: true,
      errorTokens: false,
    }),
    [TYPES_ACCOUNT.GET_TOKENS_SUCCESS]: (state: AccountReducerState, payload: TokensPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingTokens: false,
      errorTokens: false,
    }),
    [TYPES_ACCOUNT.GET_TOKENS_FAILURE]: (state: AccountReducerState, payload: TokensFailurePayload) => ({
      ...state,
      ...payload,
      address: '',
      loadingTokens: false,
      errorTokens: true,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_TOKENS]: (state: AccountReducerState, payload: GetRemoteTokensPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingRemoteTokens: true,
      errorRemoteTokens: false,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_TOKENS_SUCCESS]: (state: AccountReducerState, payload: RemoteTokensPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingRemoteTokens: false,
      errorRemoteTokens: false,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_TOKENS_FAILURE]: (state: AccountReducerState, payload: RemoteTokensFailurePayload) => ({
      ...state,
      ...payload,
      address: '',
      loadingRemoteTokens: false,
      errorRemoteTokens: true,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_ACCOUNT]: (state: AccountReducerState, payload: GetRemoteAccountPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingRemoteAccount: true,
      errorRemoteAccount: false,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_ACCOUNT_SUCCESS]: (state: AccountReducerState, payload: RemoteAccountPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingRemoteAccount: false,
      errorRemoteAccount: false,
    }),
    [TYPES_ACCOUNT.GET_REMOTE_ACCOUNT_FAILURE]: (state: AccountReducerState, payload: RemoteAccountFailurePayload) => ({
      ...state,
      ...payload,
      address: '',
      loadingRemoteAccount: false,
      errorRemoteAccount: true,
    }),
    [TYPES_ACCOUNT.RESET_REMOTE]: (state: AccountReducerState, payload: ResetRemotePayload) => ({
      ...state,
      ...payload,
      errorRemoteAccount: false,
      loadingRemoteAccount: false,
    }),

    // Special case
    [TYPES_USER.GET_USER_SUCCESS]: (state: AccountReducerState, payload: UserPayload) => ({
      ...state,
      address: payload.user.address,
    }),
    [TYPES_USER.CREATE_USER_SUCCESS]: (state: AccountReducerState, payload: UserPayload) => ({
      ...state,
      address: payload.user.address,
    }),

    // reset
    [TYPES_USER.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);
