// Types
export const TYPES_XRPL = {
  "SUBSCRIBE": "@XrplTypes/SUBSCRIBE",
  "SUBSCRIBE_SUCCESS": "@XrplTypes/SUBSCRIBE_SUCCESS",
  "SUBSCRIBE_FAILURE": "@XrplTypes/SUBSCRIBE_FAILURE",
};

// Reducer Types
export type XrplReducerState = {
  loading: boolean;
  error: boolean;
};

// Action Types
export type SubscribeXrpl = {
  type: typeof TYPES_XRPL['SUBSCRIBE'];
  payload: SubscribeXrplPayload;
};
export type SubscribeXrplSuccess = {
  type: typeof TYPES_XRPL['SUBSCRIBE_SUCCESS'];
  payload: SubscribeXrplSuccessPayload;
};
export type SubscribeXrplFailure = {
  type: typeof TYPES_XRPL['SUBSCRIBE_FAILURE'];
  payload: SubscribeXrplFailurePayload;
};

// Payload Types
export type SubscribeXrplPayload = {
  address: string;
};
export type SubscribeXrplSuccessPayload = {};
export type SubscribeXrplFailurePayload = {};
