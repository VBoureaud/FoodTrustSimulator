import { 
  CreateUserPayload,
  GetUserPayload,
  UpdateUserPayload,
  DeleteUserPayload,
  GetAllUsersPayload,
} from "../types/UserTypes";
import { buildRequest } from "@utils/helpers";
import { apiServer } from "@config";

export const register = (data: CreateUserPayload) => {
  return buildRequest(
    apiServer.register.url,
    apiServer.register.method,
    data,
  );
};
export const getUser = (data: GetUserPayload) => {
  return buildRequest(
    apiServer.getUser.url + '/' + data.address,
    apiServer.getUser.method,
  );
};
export const patchUser = (data: UpdateUserPayload) => {
  let body;
  if (data['profile']) body = { profile: data['profile'] };
  else if (data['quest']) body = { quest: data['quest'] };
  return buildRequest(
    apiServer.patchUser.url + '/' + data.address,
    apiServer.patchUser.method,
    body,
  );
};

export const deleteUser = (data: DeleteUserPayload) => {
  return buildRequest(
    apiServer.deleteUser.url,
    apiServer.deleteUser.method,
    data,
  );
};

export const getAll = (data: GetAllUsersPayload) => {
  let filter;
  if (data.searchType) {
    filter = `&${data.searchType}=${data.searchValue ? data.searchValue : ''}`;
  }
  const url = apiServer.getAll.url + '?sortBy=experience:asc' + filter;
  return buildRequest(
    url,
    apiServer.getAll.method,
  );
};