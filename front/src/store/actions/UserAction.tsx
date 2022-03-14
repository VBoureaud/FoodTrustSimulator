import {
  TYPES_USER,
  CreateUser,
  CreateUserSuccess,
  CreateUserFailure,
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
} from "../types/UserTypes";

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
