// Types
export const TYPES_ACCOUNT = {
  "GET_ACCOUNT": "@AccountTypes/GET_ACCOUNT",
  "GET_ACCOUNT_SUCCESS": "@AccountTypes/GET_ACCOUNT_SUCCESS",
  "GET_ACCOUNT_FAILURE": "@AccountTypes/GET_ACCOUNT_FAILURE",
  "GET_TX": "@AccountTypes/GET_TX",
  "GET_TX_SUCCESS": "@AccountTypes/GET_TX_SUCCESS",
  "GET_TX_FAILURE": "@AccountTypes/GET_TX_FAILURE",
  "GET_TOKENS": "@AccountTypes/GET_TOKENS",
  "GET_TOKENS_SUCCESS": "@AccountTypes/GET_TOKENS_SUCCESS",
  "GET_TOKENS_FAILURE": "@AccountTypes/GET_TOKENS_FAILURE",
  "GET_REMOTE_TOKENS": "@AccountTypes/GET_REMOTE_TOKENS",
  "GET_REMOTE_TOKENS_SUCCESS": "@AccountTypes/GET_REMOTE_TOKENS_SUCCESS",
  "GET_REMOTE_TOKENS_FAILURE": "@AccountTypes/GET_REMOTE_TOKENS_FAILURE",
  "REFRESH": "@AccountTypes/REFRESH",
  "REFRESH_SUCCESS": "@AccountTypes/REFRESH_SUCCESS",
  "REFRESH_FAILURE": "@AccountTypes/REFRESH_FAILURE",
  "LOGOUT": "@AccountTypes/LOGOUT",
  "RESET_REMOTE_TOKENS": "@AccountTypes/RESET_REMOTE_TOKENS",
};

// Reducer Types
export type AccountReducerState = {
  address: string;
  errorMsg: string;
  errorSignUpMsg: string;
  account?: Account;
  nfts?: Nfts[];
  transactions?: Transactions[];
  remote_address: string;
  remote_nfts: Nfts[];
  remote_name: string;
  remote_profile: string;
  remote_errorMsg: string;
  errorAccount: boolean;
  loadingAccount: boolean;
  errorTokens: boolean;
  loadingTokens: boolean;
  errorRemoteTokens: boolean;
  loadingRemoteTokens: boolean;
  errorRefresh: boolean;
  loadingRefresh: boolean;
  errorTx: boolean;
  loadingTx: boolean;
};

// Action Types
export type GetAccount = {
  type: typeof TYPES_ACCOUNT['GET_ACCOUNT'];
  payload: GetAccountPayload;
};
export type GetAccountSuccess = {
  type: typeof TYPES_ACCOUNT['GET_ACCOUNT_SUCCESS'];
  payload: AccountPayload;
};
export type GetAccountFailure = {
  type: typeof TYPES_ACCOUNT['GET_ACCOUNT_FAILURE'];
  payload: AccountFailurePayload;
};
export type GetTx = {
  type: typeof TYPES_ACCOUNT['GET_TX'];
  payload: GetAccountPayload;
};
export type GetTxSuccess = {
  type: typeof TYPES_ACCOUNT['GET_TX_SUCCESS'];
  payload: TransactionsPayload;
};
export type GetTxFailure = {
  type: typeof TYPES_ACCOUNT['GET_TX_FAILURE'];
  payload: AccountFailurePayload;
};
export type GetTokens = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS'];
  payload: GetTokensPayload;
};
export type GetTokensSuccess = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS_SUCCESS'];
  payload: TokensPayload;
};
export type GetTokensFailure = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS_FAILURE'];
  payload: TokensFailurePayload;
};
export type GetRemoteTokens = {
  type: typeof TYPES_ACCOUNT['GET_REMOTE_TOKENS'];
  payload: GetRemoteTokensPayload;
};
export type GetRemoteTokensSuccess = {
  type: typeof TYPES_ACCOUNT['GET_REMOTE_TOKENS_SUCCESS'];
  payload: RemoteTokensPayload;
};
export type GetRemoteTokensFailure = {
  type: typeof TYPES_ACCOUNT['GET_REMOTE_TOKENS_FAILURE'];
  payload: RemoteTokensFailurePayload;
};
export type Refresh = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS'];
};
export type RefreshSuccess = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS_SUCCESS'];
  payload: GetTokensPayload;
};
export type RefreshFailure = {
  type: typeof TYPES_ACCOUNT['GET_TOKENS_FAILURE'];
};
export type Logout = {
  type: typeof TYPES_ACCOUNT['LOGOUT'];
};
export type ResetRemoteTokens = {
  type: typeof TYPES_ACCOUNT['RESET_REMOTE_TOKENS'];
};

// Payload Types
export type GetTokensPayload = {
  address: string;
};
export type TokensPayload = {
  nfts?: Nfts[];
};
export type TokensFailurePayload = {
  errorMsg: string;
};
export type GetRemoteTokensPayload = {
  remote_address: string;
  remote_name: string;
  remote_profile: string;
};
export type RemoteTokensPayload = {
  remote_nfts?: Nfts[];
};
export type RemoteTokensFailurePayload = {
  remote_errorMsg: string;
};
export type GetAccountPayload = {
  address: string;
};
export type AccountPayload = {
  account: Account;
};
export type TransactionsPayload = {
  transactions: Transactions[];
};
export type Account = {
  account_data: AccountData;
  ledger_hash: string;
  ledger_index: string;
  validated: boolean;
};
export type Nfts = {
  Flags: string;
  Issuer: string;
  TokenID: string;
  TokenTaxon: number;
  URI: string;
  nft_serial: string;
};
export type AccountData = {
  Account: string;
  Balance: string;
  BurnedTokens?: number;
  Flags: number;
  LedgerEntryType: string;
  MintedTokens?: number;
  OwnerCount: number;
  PreviousTxnID: string;
  PreviousTxnLgrSeq: number;
  Sequence: number;
  index: string;
};
export type AccountFailurePayload = {
  errorMsg: string;
};

// Tx types
export type Transactions = {
  meta: MetaTx;
  tx: Tx;
  validated: boolean;
};
export type MetaTx = {
  TransactionIndex: number;
  TransactionResult: string;
  AffectedNodes: any;
}
export type Tx = {
  Account: string;
  Amount: string;
  Fee: string;
  Flags: number;
  LastLedgerSequence: number;
  Owner?: string;
  BuyOffer?: string;
  Sequence: number;
  SigningPubKey: string;
  TransactionType: string;
  TxnSignature: string;
  date: number;
  hash: string;
  inLedger: number;
  ledger_index: number;
}
