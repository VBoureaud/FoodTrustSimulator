import {
  TYPES_USER,
  UserPayload,
  UsersPayload,
  UserReducerState,
  CreateUserPayload,
  CreateUserFailurePayload,
  GetUserPayload,
  GetUserFailurePayload,
  UpdateUserPayload,
  UpdateUserFailurePayload,
  DeleteUserPayload,
  DeleteUserFailurePayload,
  GetAllUsersPayload,
  GetAllUsersFailurePayload,
} from "../types/UserTypes";

import {
  TYPES_ACCOUNT,
} from "../types/AccountTypes";

import { createReducer } from "@utils/helpers";

const defaultState: UserReducerState = {
  user: null,
  users: null,
  usersPage: 1,
  searchType: 'name',
  searchValue: '',
  errorSignUpMsg: '', // todo delet ?
  errorMsg: '',
  loadingCreate: false,
  errorCreate: false,
  errorGetOne: false,
  loadingGetOne: false,
  errorUpdate: false,
  loadingUpdate: false,
  errorDelete: false,
  loadingDelete: false,
  errorGetAll: false,
  loadingGetAll: false,
  quest: false,
  questSuccess: false,
  // sign up
  name: null,
  profile: null,
  location: null,
  address: null,
  jwt: '',
  walletType: '',
};

export const userReducer = createReducer(
  {
    [TYPES_USER.CREATE_USER]: (state: UserReducerState, payload: CreateUserPayload) => ({
      ...state,
      ...payload,
      errorSignUpMsg: '',
      loadingCreate: true,
      errorCreate: false,
    }),
    [TYPES_USER.CREATE_USER_SUCCESS]: (state: UserReducerState, payload: UserPayload) => ({
      ...state,
      ...payload,
      errorSignUpMsg: '',
      loadingCreate: false,
      errorCreate: false,
    }),
    [TYPES_USER.CREATE_USER_FAILURE]: (state: UserReducerState, payload: CreateUserFailurePayload) => ({
      ...state,
      ...payload,
      loadingCreate: false,
      errorCreate: true,
    }),
    [TYPES_USER.GET_USER]: (state: UserReducerState, payload: GetUserPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingGetOne: true,
      errorGetOne: false,
    }),
    [TYPES_USER.GET_USER_SUCCESS]: (state: UserReducerState, payload: UserPayload) => ({
      ...state,
      ...payload,
      errorMsg: '',
      loadingGetOne: false,
      errorGetOne: false,
    }),
    [TYPES_USER.GET_USER_FAILURE]: (state: UserReducerState, payload: GetUserFailurePayload) => ({
      ...state,
      ...payload,
      loadingGetOne: false,
      errorGetOne: true,
    }),
    [TYPES_USER.UPDATE_USER]: (state: UserReducerState, payload: UpdateUserPayload) => ({
      ...state,
      ...payload,
      loadingUpdate: true,
      errorUpdate: false,
      questSuccess: false,
    }),
    [TYPES_USER.UPDATE_USER_SUCCESS]: (state: UserReducerState, payload: UserPayload) => ({
      ...state,
      ...payload,
      loadingUpdate: false,
      errorUpdate: false,
      questSuccess: state.quest ? true : false,
    }),
    [TYPES_USER.UPDATE_USER_FAILURE]: (state: UserReducerState, payload: UpdateUserFailurePayload) => ({
      ...state,
      ...payload,
      loadingUpdate: false,
      errorUpdate: true,
      questSuccess: false,
    }),
    [TYPES_USER.DELETE_USER]: (state: UserReducerState, payload: DeleteUserPayload) => ({
      ...state,
      ...payload,
      loadingDelete: true,
      errorDelete: false,
    }),
    [TYPES_USER.DELETE_USER_SUCCESS]: (state: UserReducerState) => ({
      ...state,
      loadingDelete: false,
      errorDelete: false,
    }),
    [TYPES_USER.DELETE_USER_FAILURE]: (state: UserReducerState, payload: DeleteUserFailurePayload) => ({
      ...state,
      ...payload,
      loadingDelete: false,
      errorDelete: true,
    }),
    [TYPES_USER.GET_ALL]: (state: UserReducerState, payload: GetAllUsersPayload) => ({
      ...state,
      ...payload,
      loadingGetAll: true,
      errorGetAll: false,
    }),
    [TYPES_USER.GET_ALL_SUCCESS]: (state: UserReducerState, payload: UsersPayload) => ({
      ...state,
      ...payload,
      loadingGetAll: false,
      errorGetAll: false,
    }),
    [TYPES_USER.GET_ALL_FAILURE]: (state: UserReducerState, payload: GetAllUsersFailurePayload) => ({
      ...state,
      ...payload,
      loadingGetAll: false,
      errorGetAll: true,
    }),

    [TYPES_ACCOUNT.LOGOUT]: () => ({
      ...defaultState
    }),
  },
  defaultState
);
