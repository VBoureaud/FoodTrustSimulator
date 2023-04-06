import {
  TYPES_ACCOUNT,
  GetAccountPayload,
  AccountPayload,
  TransactionsPayload,
  AccountFailurePayload,
  GetAccount,
  GetAccountSuccess,
  GetAccountFailure,
  GetTx,
  GetTxSuccess,
  GetTxFailure,
  GetTokensPayload,
  TokensPayload,
  TokensFailurePayload,
  GetTokens,
  GetTokensSuccess,
  GetTokensFailure,
  GetRemoteAccount,
  GetRemoteAccountSuccess,
  GetRemoteAccountFailure,
  GetRemoteAccountPayload,
  RemoteAccountPayload,
  RemoteAccountFailurePayload,
  GetRemoteTokensPayload,
  RemoteTokensPayload,
  RemoteTokensFailurePayload,
  GetRemoteTokens,
  GetRemoteTokensSuccess,
  GetRemoteTokensFailure,
  Refresh,
  RefreshSuccess,
  RefreshFailure,
  ResetRemote,
  ResetRemotePayload,
} from "../types/AccountTypes";

export function getAccount(data: GetAccountPayload): GetAccount {
  return {
    type: TYPES_ACCOUNT.GET_ACCOUNT,
    payload: data,
  };
}
export function getAccountSuccess(data: AccountPayload): GetAccountSuccess {
  return {
    type: TYPES_ACCOUNT.GET_ACCOUNT_SUCCESS,
    payload: data,
  };
}
export function getAccountFailure(data: AccountFailurePayload): GetAccountFailure {
  return {
    type: TYPES_ACCOUNT.GET_ACCOUNT_FAILURE,
    payload: data,
  };
}

export function getTx(data: GetAccountPayload): GetTx {
  return {
    type: TYPES_ACCOUNT.GET_TX,
    payload: data,
  };
}
export function getTxSuccess(data: TransactionsPayload): GetTxSuccess {
  return {
    type: TYPES_ACCOUNT.GET_TX_SUCCESS,
    payload: data,
  };
}
export function getTxFailure(data: AccountFailurePayload): GetTxFailure {
  return {
    type: TYPES_ACCOUNT.GET_TX_FAILURE,
    payload: data,
  };
}

export function getTokens(data: GetTokensPayload): GetTokens {
  return {
    type: TYPES_ACCOUNT.GET_TOKENS,
    payload: data,
  };
}
export function getTokensSuccess(data: TokensPayload): GetTokensSuccess {
  return {
    type: TYPES_ACCOUNT.GET_TOKENS_SUCCESS,
    payload: data,
  };
}
export function getTokensFailure(data: TokensFailurePayload): GetTokensFailure {
  return {
    type: TYPES_ACCOUNT.GET_TOKENS_FAILURE,
    payload: data,
  };
}

export function getRemoteAccount(data: GetRemoteAccountPayload): GetRemoteAccount {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_ACCOUNT,
    payload: data,
  };
}
export function getRemoteAccountSuccess(data: RemoteAccountPayload): GetRemoteAccountSuccess {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_ACCOUNT_SUCCESS,
    payload: data,
  };
}
export function getRemoteAccountFailure(data: RemoteAccountFailurePayload): GetRemoteAccountFailure {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_ACCOUNT_FAILURE,
    payload: data,
  };
}
export function getRemoteTokens(data: GetRemoteTokensPayload): GetRemoteTokens {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_TOKENS,
    payload: data,
  };
}
export function getRemoteTokensSuccess(data: RemoteTokensPayload): GetRemoteTokensSuccess {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_TOKENS_SUCCESS,
    payload: data,
  };
}
export function getRemoteTokensFailure(data: RemoteTokensFailurePayload): GetRemoteTokensFailure {
  return {
    type: TYPES_ACCOUNT.GET_REMOTE_TOKENS_FAILURE,
    payload: data,
  };
}
export function resetRemote(data: ResetRemotePayload): ResetRemote {
  return {
    type: TYPES_ACCOUNT.RESET_REMOTE,
    payload: data,
  };
}
export function doRefresh(): Refresh {
  return {
    type: TYPES_ACCOUNT.REFRESH,
  };
}
export function doRefreshSuccess(data: GetTokensPayload): RefreshSuccess {
  return {
    type: TYPES_ACCOUNT.REFRESH_SUCCESS,
    payload: data,
  };
}
export function doRefreshFailure(): RefreshFailure {
  return {
    type: TYPES_ACCOUNT.REFRESH_FAILURE,
  };
}