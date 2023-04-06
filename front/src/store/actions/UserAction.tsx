import {
  TYPES_USER,
  CreateUser,
  CreateUserSuccess,
  CreateUserFailure,
  BurnOut,
  BurnOutSuccess,
  BurnOutFailure,
  BurnOutPayload,
  BurnOutFailurePayload,
  UserPayload,
  CreateUserPayload,
  CreateUserFailurePayload,
  GetUser,
  GetUserSuccess,
  GetUserFailure,
  GetUserFailurePayload,
  GetUserPayload,
  UpdateUserPayload,
  UpdateUserFailurePayload,
  UpdateUser,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserPayload,
  DeleteUserFailurePayload,
  DeleteUser,
  DeleteUserSuccess,
  DeleteUserFailure,
  GetAllUsersPayload,
  UsersPayload,
  GetAllUsersFailurePayload,
  GetAllUsers,
  GetAllUsersSuccess,
  GetAllUsersFailure,
  CreateAd,
  CreateAdSuccess,
  CreateAdFailure,
  CreateAdPayload,
  CreateAdFailurePayload,
  RemoteUserPayload,
  RemoteUser,
  Logout,
  Reset,
  AddSessionActionPayload,
  AddSessionAction,
} from "../types/UserTypes";

export function createAd(data: CreateAdPayload): CreateAd {
  return {
    type: TYPES_USER.CREATE_AD,
    payload: data,
  };
}
export function createAdSuccess(data: UsersPayload): CreateAdSuccess {
  return {
    type: TYPES_USER.CREATE_AD_SUCCESS,
    payload: data,
  };
}
export function createAdFailure(data: CreateAdFailurePayload): CreateAdFailure {
  return {
    type: TYPES_USER.CREATE_AD_FAILURE,
    payload: data,
  };
}
export function burnOut(data: BurnOutPayload): BurnOut {
  return {
    type: TYPES_USER.BURN_OUT,
    payload: data,
  };
}
export function burnOutSuccess(data: UserPayload): BurnOutSuccess {
  return {
    type: TYPES_USER.BURN_OUT_SUCCESS,
    payload: data,
  };
}
export function burnOutFailure(data: BurnOutFailurePayload): BurnOutFailure {
  return {
    type: TYPES_USER.BURN_OUT_FAILURE,
    payload: data,
  };
}
export function getAllUsers(data: GetAllUsersPayload): GetAllUsers {
  return {
    type: TYPES_USER.GET_ALL,
    payload: data,
  };
}
export function getAllUsersSuccess(data: UsersPayload): GetAllUsersSuccess {
  return {
    type: TYPES_USER.GET_ALL_SUCCESS,
    payload: data,
  };
}
export function getAllUsersFailure(data: GetAllUsersFailurePayload): GetAllUsersFailure {
  return {
    type: TYPES_USER.GET_ALL_FAILURE,
    payload: data,
  };
}
export function deleteUser(data: DeleteUserPayload): DeleteUser {
  return {
    type: TYPES_USER.UPDATE_USER,
    payload: data,
  };
}
export function deleteUserSuccess(): DeleteUserSuccess {
  return {
    type: TYPES_USER.UPDATE_USER_SUCCESS,
  };
}
export function deleteUserFailure(data: DeleteUserFailurePayload): DeleteUserFailure {
  return {
    type: TYPES_USER.UPDATE_USER_FAILURE,
    payload: data,
  };
}
export function updateUser(data: UpdateUserPayload): UpdateUser {
  return {
    type: TYPES_USER.UPDATE_USER,
    payload: data,
  };
}
export function updateUserSuccess(data: UserPayload): UpdateUserSuccess {
  return {
    type: TYPES_USER.UPDATE_USER_SUCCESS,
    payload: data,
  };
}
export function updateUserFailure(data: UpdateUserFailurePayload): UpdateUserFailure {
  return {
    type: TYPES_USER.UPDATE_USER_FAILURE,
    payload: data,
  };
}
export function getUser(data: GetUserPayload): GetUser {
  return {
    type: TYPES_USER.GET_USER,
    payload: data,
  };
}
export function getUserSuccess(data: UserPayload): GetUserSuccess {
  return {
    type: TYPES_USER.GET_USER_SUCCESS,
    payload: data,
  };
}
export function getUserFailure(data: GetUserFailurePayload): GetUserFailure {
  return {
    type: TYPES_USER.GET_USER_FAILURE,
    payload: data,
  };
}
export function createUser(data: CreateUserPayload): CreateUser {
  return {
    type: TYPES_USER.CREATE_USER,
    payload: data,
  };
}
export function createUserSuccess(data: UserPayload): CreateUserSuccess {
  return {
    type: TYPES_USER.CREATE_USER_SUCCESS,
    payload: data,
  };
}
export function createUserFailure(data: CreateUserFailurePayload): CreateUserFailure {
  return {
    type: TYPES_USER.CREATE_USER_FAILURE,
    payload: data,
  };
}
export function remoteUser(data: RemoteUserPayload): RemoteUser {
  return {
    type: TYPES_USER.REMOTE_USER,
    payload: data,
  };
}
export function logout(): Logout {
  return {
    type: TYPES_USER.LOGOUT,
  };
}
export function reset(): Reset {
  return {
    type: TYPES_USER.RESET,
  };
}
export function addSessionAction(data: AddSessionActionPayload): AddSessionAction {
  return {
    type: TYPES_USER.ADD_SESSION_ACTION,
    payload: data,
  };
}