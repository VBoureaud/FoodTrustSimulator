// Types
export const TYPES_URI = {
  "REGISTER": "@UriTypes/REGISTER",
  "REGISTER_SUCCESS": "@UriTypes/REGISTER_SUCCESS",
  "REGISTER_FAILURE": "@UriTypes/REGISTER_FAILURE",
  "GET_URI": "@UriTypes/GET_URI",
  "GET_URI_SUCCESS": "@UriTypes/GET_URI_SUCCESS",
  "GET_URI_FAILURE": "@UriTypes/GET_URI_FAILURE",
  "UPDATE": "@UriTypes/UPDATE",
  "UPDATE_SUCCESS": "@UriTypes/UPDATE_SUCCESS",
  "UPDATE_FAILURE": "@UriTypes/UPDATE_FAILURE",
  "ADD": "@UriTypes/ADD",
};

// Reducer Types
export type UriReducerState = {
  uris?: Uri[];
  address?: string;
  name?: string;
  nftToken?: string;
  loading: boolean;
  error: boolean;
};

// Action Types
export type GetUris = {
  type: typeof TYPES_URI['GET_URI'];
  payload: GetUrisPayload;
};
export type GetUrisSuccess = {
  type: typeof TYPES_URI['GET_URI_SUCCESS'];
  payload: UrisPayload;
};
export type GetUrisFailure = {
  type: typeof TYPES_URI['GET_URI_FAILURE'];
  payload: GetUrisFailurePayload;
};
// Add new Uri registered
export type AddUri = {
  type: typeof TYPES_URI['ADD'];
  payload: AddUriPayload;
};

// Payload Types
export type UrisPayload = {
  limit: number;
  page: number;
  results: Uri[];
  totalPages: number;
  totalResults: number;
};
export type GetUrisPayload = {
  name?: string;
  nftToken?: string;
  address?: string;
}
export type GetUrisFailurePayload = {}
export type RegisterUriPayload = {
  name: string;
  nftToken: string;
  parents?: string[];
}
export type UpdateUrisPayload = {
  name: string;
  owner?: string;
  offerBuy?: string;
}
export type AddUriPayload = {
  uri: Uri;
}

// Data Types
export type Uri = {
  name: string;
  description: string;
  image: string;
  properties: UriProperties;
};
export type UriProperties = {
  owner: string;
  ownerHistory?: string[];
  nftToken: string;
  offerBuy?: string[];
  parents?: string[];
};