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
};

// Reducer Types
export type UserReducerState = {
  user?: User;
  users?: UsersPayload;
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
  quest?: boolean;
  questSuccess?: boolean;
  // Sign up
  name?: string | null;
  profile?: string | null;
  location?: City | null;
  address: string;
  walletType?: string;
  jwt?: string;
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

// Payload Types
export type User = {
  name: string,
  address: string,
  profile: string,
  experience: number,
  transactions: number,
  pocket: number,
  location?: City,
  tokenBuildable?: string[],
  tokenNeeded?: string[],
};
export type UserPayload = {
  user: User,
};
export type UsersPayload = {
  limit: number;
  page: number;
  results: User[],
  totalPages: number;
  totalResults: number;
};

export type City = {
  name: string;
  country: string;
  lat: string;
  lng: string;
}
export type CreateUserPayload = {
  name: string,
  address: string,
  location?: City,
};
export type CreateUserFailurePayload = {
  errorSignUpMsg: string;
};
export type GetUserPayload = {
  address: string,
  walletType?: string,
  jwt?: string,
};
export type GetUserFailurePayload = {};
export type UpdateUserPayload = {
  address?: string,
  quest?: boolean,
  profile?: string,
};
export type UpdateUserFailurePayload = {};
export type DeleteUserPayload = {
  address: string,
};
export type DeleteUserFailurePayload = {};
export type GetAllUsersPayload = { 
  usersPage: number;
  searchValue?: string;
  searchType?: string;
};
export type GetAllUsersFailurePayload = {};
