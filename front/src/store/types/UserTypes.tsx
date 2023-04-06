// Types
export const TYPES_USER = {
  "CREATE_USER": "@UserTypes/CREATE_USER",
  "CREATE_USER_SUCCESS": "@UserTypes/CREATE_USER_SUCCESS",
  "CREATE_USER_FAILURE": "@UserTypes/CREATE_USER_FAILURE",
  "GET_USER": "@UserTypes/GET_USER",
  "GET_USER_SUCCESS": "@UserTypes/GET_USER_SUCCESS",
  "GET_USER_FAILURE": "@UserTypes/GET_USER_FAILURE",
  "UPDATE_USER": "@UserTypes/UPDATE_USER",
  "UPDATE_USER_SUCCESS": "@UserTypes/UPDATE_USER_SUCCESS",
  "UPDATE_USER_FAILURE": "@UserTypes/UPDATE_USER_FAILURE",
  "DELETE_USER": "@UserTypes/DELETE_USER",
  "DELETE_USER_SUCCESS": "@UserTypes/DELETE_USER_SUCCESS",
  "DELETE_USER_FAILURE": "@UserTypes/DELETE_USER_FAILURE",
  "GET_ALL": "@UserTypes/GET_ALL",
  "GET_ALL_SUCCESS": "@UserTypes/GET_ALL_SUCCESS",
  "GET_ALL_FAILURE": "@UserTypes/GET_ALL_FAILURE",
  "CREATE_AD": "@UserTypes/CREATE_AD",
  "CREATE_AD_SUCCESS": "@UserTypes/CREATE_AD_SUCCESS",
  "CREATE_AD_FAILURE": "@UserTypes/CREATE_AD_FAILURE",
  "REMOTE_USER": "@UserTypes/REMOTE_USER",
  "BURN_OUT": "@UserTypes/BURN_OUT",
  "BURN_OUT_SUCCESS": "@UserTypes/BURN_OUT_SUCCESS",
  "BURN_OUT_FAILURE": "@UserTypes/BURN_OUT_FAILURE",
  "LOGOUT": "@UserTypes/LOGOUT",
  "RESET": "@UserTypes/RESET",
  "ADD_SESSION_ACTION": "@UserTypes/ADD_SESSION_ACTION",
};

// Reducer Types
export type UserReducerState = {
  user?: User;
  users?: UsersPayload;
  userRemote?: User;
  usersPage: number;
  searchType: string;
  searchValue: string;
  errorSignUpMsg: string;
  errorMsg: string;
  errorCreate: boolean;
  loadingCreate: boolean;
  errorGetOne: boolean;
  loadingGetOne: boolean;
  errorUpdate: boolean;
  loadingUpdate: boolean;
  errorDelete: boolean;
  loadingDelete: boolean;
  errorGetAll: boolean;
  loadingGetAll: boolean;
  errorCreateAd: boolean;
  loadingCreateAd: boolean;
  loadingBurnout: boolean;
  errorBurnout: boolean;
  quest?: boolean;
  questSuccess?: boolean;
  ad?: AdToSend;
  // Sign up
  name?: string | null;
  type?: string | null;
  image?: string | null;
  location?: City | null;
  address: string;
  server: string;
  walletType?: string;
  jwt?: string;
  webSocket: boolean;
};

// Action Types
export type CreateUser = {
  type: typeof TYPES_USER['CREATE_USER'];
  payload: CreateUserPayload;
};
export type CreateUserSuccess = {
  type: typeof TYPES_USER['CREATE_USER_SUCCESS'];
  payload: UserPayload;
};
export type CreateUserFailure = {
  type: typeof TYPES_USER['CREATE_USER_FAILURE'];
  payload: CreateUserFailurePayload;
};
export type BurnOut = {
  type: typeof TYPES_USER['BURN_OUT'];
  payload: BurnOutPayload;
};
export type BurnOutSuccess = {
  type: typeof TYPES_USER['BURN_OUT_SUCCESS'];
  payload: UserPayload;
};
export type BurnOutFailure = {
  type: typeof TYPES_USER['BURN_OUT_FAILURE'];
  payload: BurnOutFailurePayload;
};
export type GetUser = {
  type: typeof TYPES_USER['GET_USER'];
  payload: GetUserPayload;
};
export type GetUserSuccess = {
  type: typeof TYPES_USER['GET_USER_SUCCESS'];
  payload: UserPayload;
};
export type GetUserFailure = {
  type: typeof TYPES_USER['GET_USER_FAILURE'];
  payload: GetUserFailurePayload;
};
export type UpdateUser = {
  type: typeof TYPES_USER['UPDATE_USER'];
  payload: UpdateUserPayload;
};
export type UpdateUserSuccess = {
  type: typeof TYPES_USER['UPDATE_USER_SUCCESS'];
  payload: UserPayload;
};
export type UpdateUserFailure = {
  type: typeof TYPES_USER['UPDATE_USER_FAILURE'];
  payload: UpdateUserFailurePayload;
};
export type DeleteUser = {
  type: typeof TYPES_USER['DELETE_USER'];
  payload: DeleteUserPayload;
};
export type DeleteUserSuccess = {
  type: typeof TYPES_USER['DELETE_USER_SUCCESS'];
};
export type DeleteUserFailure = {
  type: typeof TYPES_USER['DELETE_USER_FAILURE'];
  payload: DeleteUserFailurePayload;
};
export type GetAllUsers = {
  type: typeof TYPES_USER['GET_ALL'];
  payload: GetAllUsersPayload;
};
export type GetAllUsersSuccess = {
  type: typeof TYPES_USER['GET_ALL_SUCCESS'];
  payload: UsersPayload;
};
export type GetAllUsersFailure = {
  type: typeof TYPES_USER['GET_ALL_FAILURE'];
  payload: GetAllUsersFailurePayload;
};
export type CreateAd = {
  type: typeof TYPES_USER['CREATE_AD'];
  payload: CreateAdPayload;
};
export type CreateAdSuccess = {
  type: typeof TYPES_USER['CREATE_AD_SUCCESS'];
  payload: UsersPayload;
};
export type CreateAdFailure = {
  type: typeof TYPES_USER['CREATE_AD_FAILURE'];
  payload: CreateAdFailurePayload;
};
export type RemoteUser = {
  type: typeof TYPES_USER['REMOTE_USER'];
  payload: RemoteUserPayload;
};
export type Logout = {
  type: typeof TYPES_USER['LOGOUT'];
};
export type Reset = {
  type: typeof TYPES_USER['RESET'];
};
export type AddSessionAction = {
  type: typeof TYPES_USER['ADD_SESSION_ACTION'];
  payload: AddSessionActionPayload;
};

// Payload Types
export type User = {
  name: string,
  address: string,
  type: string,
  image: string,
  experience: number,
  transactions: number,
  pocket: number,
  lastCo?: string,
  location?: City,
  tokenBuildable?: string[],
  notifications: Notifications[],
  ad: Ad[],
  quest: Quest[],
  server: string,
  burnout: string[],
  sessionAction?: string[],
};
export type Quest = {
  id: number,
  date: string,
  tokenNeeded: string[],
  winDate: string,
};
export type Ad = {
  date: string,
  user: string,
  message: string,
  duree: number,
};
export type AdToSend = {
  address?: string;
  addressFrom?: string;
  addressTo: string,
  message: string,
};
export type Notifications = {
  type: number,
  title: string,
  desc: string,
  createdAt: number,
};
export type UserPayload = {
  user: User,
  webSocket?: boolean,
};
export type UsersPayload = {
  limit: number;
  page: number;
  results: User[],
  totalPages: number;
  totalResults: number;
};
export type BurnOutPayload = {
  image: string;
  type: string;
};
export type BurnOutFailurePayload = {};
export type City = {
  name: string;
  country: string;
  lat: string;
  lng: string;
}
export type CreateUserPayload = {
  name: string;
  address: string;
  type: string;
  image: string;
  location?: City;
  server: string;
};
export type CreateUserFailurePayload = {
  errorSignUpMsg: string;
};
export type GetUserPayload = {
  address: string;
  walletType?: string;
  jwt?: string;
  server?: string;
};
export type GetUserFailurePayload = {};
export type UpdateUserPayload = {
  address?: string;
  quest?: boolean;
  type?: string;
  image?: string;
  burnout?: string;
};
export type UpdateUserFailurePayload = {};
export type DeleteUserPayload = {
  address: string;
};
export type DeleteUserFailurePayload = {};
export type GetAllUsersPayload = { 
  server: string;
  usersPage: number;
  searchValue?: string;
  searchType?: string;
};
export type GetAllUsersFailurePayload = {};
export type CreateAdPayload = {
  ad: AdToSend;
};
export type CreateAdFailurePayload = {};
export type RemoteUserPayload = {
  userRemote: User;
};
export type AddSessionActionPayload = {
  action: string;
};

