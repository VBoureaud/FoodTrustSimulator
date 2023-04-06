import { Store } from 'react-notifications-component';
import { 
  CreateUserPayload,
  GetUserPayload,
  UpdateUserPayload,
  DeleteUserPayload,
  GetAllUsersPayload,
  AdToSend,
} from "../types/UserTypes";
import { buildRequest } from "@utils/helpers";
import { 
  apiServer,
  config,
  configOnChain,
} from "@config";

export const register = (data: CreateUserPayload) => {
  return buildRequest(
    apiServer.register.url,
    apiServer.register.method,
    data,
  );
};
export const queryUser = (data: GetUserPayload) => {
  return buildRequest(
    apiServer.getUser.url + `/?address=${data.address}&server=${data.server}`,
    apiServer.getUser.method,
  );
};
export const patchUser = (data: UpdateUserPayload) => {
  let body;
  if (data['burnout']) {
    body = {
      type: data['type'],
      burnout: data['burnout'],
      image: data['image'],
    };
  }
  else if (data['type']) body = { type: data['type'] };
  else if (data['quest']) body = { quest: data['quest'] };
  return buildRequest(
    apiServer.patchUser.url + '/' + data.address,
    apiServer.patchUser.method,
    body,
  );
};
export const createAd = (data: AdToSend) => {
  const body:any = {};
  body['message'] = data.message;
  body['address'] = data.addressTo;
  return buildRequest(
    apiServer.createAd.url + '/' + data.addressFrom,
    apiServer.createAd.method,
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
  const url = apiServer.getAll.url + '?server=' + encodeURIComponent(data.server) + '&sortBy=experience:asc&limit=100' + filter;
  return buildRequest(
    url,
    apiServer.getAll.method,
  );
};

export const logoutUser = (data: GetUserPayload) => {
  return buildRequest(
    apiServer.logoutUser.url + '/' + data.address + '/' + encodeURIComponent(data.server),
    apiServer.logoutUser.method,
  );
};

// Old websocket on local server - not working on vercel deployement so now we use Ably
export const subscribeGameServer = async (address: string, server: string, callback: Function) => {
  try {
    const client = new WebSocket(config.wsUrl + '?address=' + address + '&server=' + server);

    client.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.address !== address || data.server !== server) {
        //console.log('not a msg for me');
        return false;
      }
      Store.addNotification({
        //title: "Notification",
        message: data.msg,
        type: "default",
        insert: "bottom",
        container: "bottom-left",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
          pauseOnHover: true,
          click: false,
          touch: false,
        }
      });
      if (callback) {
        callback();
      }
    });
  } catch(e) {
    console.log({ e });
  }
};