import {
  TYPES_USER,
  UserPayload,
  UsersPayload,
  UserReducerState,
  CreateUserPayload,
  CreateUserFailurePayload,
  BurnOutPayload,
  BurnOutFailurePayload,
  GetUserPayload,
  GetUserFailurePayload,
  UpdateUserPayload,
  UpdateUserFailurePayload,
  DeleteUserPayload,
  DeleteUserFailurePayload,
  GetAllUsersPayload,
  GetAllUsersFailurePayload,
  CreateAdPayload,
  CreateAdFailurePayload,
  RemoteUserPayload,
  AddSessionActionPayload,
} from "../types/UserTypes";
import {
  TYPES_URI,
  DeleteUriSuccessPayload,
  AddUriPayload,
} from "../types/UriTypes";

import { createReducer } from "@utils/helpers";

const defaultState: UserReducerState = {
  user: null,
  users: null,
  userRemote: null,
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
  errorCreateAd: false,
  loadingCreateAd: false,
  loadingBurnout: false,
  errorBurnout: false,
  quest: false,
  questSuccess: false,
  ad: null,// stocked before sent to server
  // sign up or burnout
  name: null,
  type: null,
  location: null,
  address: null,
  server: null,
  webSocket: false,// is linked with ws? - todo
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
    [TYPES_USER.BURN_OUT]: (state: UserReducerState, payload: BurnOutPayload) => ({
      ...state,
      ...payload,
      loadingBurnout: true,
      errorBurnout: false,
    }),
    [TYPES_USER.BURN_OUT_SUCCESS]: (state: UserReducerState, payload: UserPayload) => ({
      ...state,
      ...payload,
      loadingBurnout: false,
      errorBurnout: false,
    }),
    [TYPES_USER.BURN_OUT_FAILURE]: (state: UserReducerState, payload: BurnOutFailurePayload) => ({
      ...state,
      ...payload,
      loadingBurnout: false,
      errorBurnout: true,
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
      searchValue: payload.searchValue ? payload.searchValue : '',
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
    [TYPES_USER.CREATE_AD]: (state: UserReducerState, payload: CreateAdPayload) => ({
      ...state,
      ...payload,
      loadingCreateAd: true,
      errorCreateAd: false,
    }),
    [TYPES_USER.CREATE_AD_SUCCESS]: (state: UserReducerState, payload: UsersPayload) => ({
      ...state,
      ...payload,
      loadingCreateAd: false,
      errorCreateAd: false,
    }),
    [TYPES_USER.CREATE_AD_FAILURE]: (state: UserReducerState, payload: CreateAdFailurePayload) => ({
      ...state,
      ...payload,
      loadingCreateAd: false,
      errorCreateAd: true,
    }),
    [TYPES_USER.REMOTE_USER]: (state: UserReducerState, payload: RemoteUserPayload) => ({
      ...state,
      ...payload,
    }),
    [TYPES_USER.LOGOUT]: (state: UserReducerState) => ({
      ...state,
    }),
    [TYPES_USER.RESET]: () => ({
      ...defaultState,
    }),
    [TYPES_USER.ADD_SESSION_ACTION]: (state: UserReducerState, payload: AddSessionActionPayload) => {
      const currentUser = state.user;
      const currentSessionAction = currentUser && currentUser.sessionAction ? currentUser.sessionAction : [];
      currentSessionAction.push(payload.action);
      const newUser = { ...currentUser, sessionAction: currentSessionAction };
      return ({
        ...state,
        user: newUser,
      });
    },

    // update session
    [TYPES_URI.DELETE_SUCCESS]: (state: UserReducerState, payload: DeleteUriSuccessPayload) => {
      const currentUser = state.user;
      currentUser.sessionAction.push('delete_' + payload.uri.image.split('#')[0]);

      return {
        ...state,
        user: currentUser,
      };
    },
    [TYPES_URI.ADD]: (state: UserReducerState, payload: AddUriPayload) => {
      const currentUser = state.user;
      currentUser.sessionAction.push('add_' + payload.uri.image.split('#')[0]);

      return {
        ...state,
        user: currentUser,
      }
    },
  },
  defaultState
);
