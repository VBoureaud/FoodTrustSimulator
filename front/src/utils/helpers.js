import { race, call } from "redux-saga/effects";

export function inDev() {
  return process.env.NODE_ENV == 'development';
}

export const createReducer =
  (map, defaultState = {}) =>
  (state = defaultState, action) => {
    const reducer = map[action.type] || ((x) => x);
    return reducer(state, action.payload);
  };

export const buildRequest = async (url, method, body = {}, bearer = null) => {
  const data = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      //Authorization: bearer !== null ? `Bearer ${bearer}` : null,
    },
    body: method !== "GET" ? JSON.stringify(body) : null,
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response) throw new Error("Request Fail");
      else if (response.code) {
        throw new Error(response.message);
      }
      return response;
    });

  return data;
};


const timeout = (ms, reject = false) =>
  new Promise((res, rej) => setTimeout(() => (reject ? rej : res)(true), ms));

export function* callApi(api, ...args) {
  try {
    const [res, timed] = yield race([call(api, ...args), call(timeout, 30000)]);
    if (timed) {
      throw new Error(timed);
    }
    return res;
  } catch (e) {
    throw e;
  }
}

export const updateArrayOfObjectByRef = (currentArr, updateArr, fieldRef) => {
  const newArr = currentArr ? currentArr.slice() : [];
  const cArr = currentArr ? currentArr.map(e => e[fieldRef]) : [];
  const uArr = updateArr ? updateArr.map(e => e[fieldRef]) : [];
  for (let i = 0; i < uArr.length; i++){
    if (cArr.indexOf(uArr[i]) != -1) {
      newArr[cArr.indexOf(uArr[i])] = updateArr[i];
    }
  }
  const toAdd = updateArr.filter((e) => cArr.indexOf(e[fieldRef]) == -1);
  return [ ...newArr, ...toAdd ];
};

export const displayDate = (dateStr, withHours=false, dateObj=null) => {
  if (!dateStr && !dateObj)
    return '';
  const myDate = !dateObj ? new Date(dateStr) : dateObj;
  const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
    + ('0' + myDate.getDate()).slice(-2) + '/' + 
    + myDate.getFullYear();
  const fullHours = ('0' + myDate.getHours()).slice(-2) 
    + ':' + ('0' + myDate.getMinutes()).slice(-2)
    + ':' + ('0' + myDate.getSeconds()).slice(-2);
  return fullDate + (withHours ? ' ' + fullHours : '');
}

export const hashURI = (address, type) => {
  const date = new Date().getTime();
  return address + date + type;
}
export const decodeHashURI = (s) => {
  const dateSize = 13;
  const typeSize = 6;
  const addressSize = s.length - (dateSize + typeSize);
  const address = s.slice(0, addressSize);
  const date = new Date(parseInt(s.slice(addressSize, addressSize + dateSize)));
  const type = s.slice(addressSize + dateSize, s.length);
  return {
    address,
    date,
    type
  };
};

export const unPad = (str) => {
  if (!str) return str;
  let i = 0;
  while (i < str.length && str[i] == '0')
    i++;
  return str.slice(i, str.length);
}

export const getTypeFromToken = (tokenID, uris) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  const uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  return uriName ? unPad(decodeHashURI(uriName + '').type) : uriName;
}
export const getDateFromToken = (tokenID, uris) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  const uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  return uriName ? displayDate(decodeHashURI(uriName + '').date, true) : '';
}
export const getAddrFromToken = (tokenID, uris) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  const uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  return uriName ? decodeHashURI(uriName + '').address : '';
}

export const dataGet = (data, str, byDefault=0) => {
  const splitted = str.split('.');
  for (let i = 0; i < splitted.length; i++) {
    if (data[splitted[i]] == undefined)
      return byDefault;
    data = data[splitted[i]];
  }
  return data;
};

export const obj1HaveOrSupObj2 = (obj1, obj2) => {
  const keys = Object.keys(obj2);
  for (let i = 0; i < keys.length; i++)
    if (obj1[keys[i]] == undefined || obj1[keys[i]] < obj2[keys[i]])
      return false;
  return true;
}