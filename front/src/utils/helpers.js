// WS Call
if (typeof module !== "undefined") var xrpl = require('xrpl');
import { race, call } from "redux-saga/effects";

export function inDev() {
  return process.env.NODE_ENV == 'development';
}

export const buildArray = (size) => Array.apply(null, Array(size)).map(function (x, i) { return i; })

// get two array of position 
// compare if close or not according to rayon
export const calculateDistance = (player, coord, rayon) => {
  const playerX = player[0];
  const playerY = player[1];
  const coordX = coord[0];
  const coordY = coord[1];
  const distance = Math.sqrt((Math.pow(coordX-playerX,2))+(Math.pow(coordY-playerY,2)));
  return distance;
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
  const monthNamesFull = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const myDate = !dateObj ? new Date(dateStr) : dateObj;
  
  const fullDate = monthNames[myDate.getMonth()] + ' '
    + ('0' + myDate.getDate()).slice(-2) + ', ' + 
    + myDate.getFullYear();

  /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
    + ('0' + myDate.getDate()).slice(-2) + '/' + 
    + myDate.getFullYear();*/
  const fullHours = ('0' + myDate.getHours()).slice(-2) 
    + ':' + ('0' + myDate.getMinutes()).slice(-2)
    + ':' + ('0' + myDate.getSeconds()).slice(-2);
  return fullDate + (withHours ? ' ' + fullHours : '');
}

// params: dateStr date str milliseconds
export const displayDiffDate = (dateStr, displayLang='en') => {
  const current_d = new Date().getTime();
  const diff = parseInt(current_d) - parseInt(dateStr);
  const lang = {
    'fr': {
      sec: 'secondes',
      min: 'minutes',
      ho: 'heures',
      da: 'jours',
    },
    'en': {
      sec: 'seconds',
      min: 'minutes',
      ho: 'hours',
      da: 'days',
    },
  }
  let ret;
  if (diff < 60000) {
    ret = parseInt(diff / 1000) + ' ' + lang[displayLang].sec;
  }
  else if (diff < 3600000) {
    ret = parseInt(diff / (1000 * 60)) + ' ' + lang[displayLang].min;
  }
  else if (diff < 86400000) {
    ret = parseInt(diff / (1000 * 60 * 60)) + ' ' + lang[displayLang].ho;
  } else {
    ret = parseInt(diff / (1000 * 60 * 60 * 24)) + ' ' + lang[displayLang].da;
  }
  // remove 's' if num is 1
  if (parseInt(ret.split(' ')[0]) === 1)
    return ret.slice(0, -1);
  return ret;
}

export const diffHoursDateNow = (dateStr) => {
  return Math.abs(new Date() - new Date(parseInt(dateStr))) / 36e5;
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

export const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const unPad = (str) => {
  if (!str) return str;
  let i = 0;
  while (i < str.length && str[i] == '0')
    i++;
  return str.slice(i, str.length);
}

export const doPad = (str, size) => {
  if (!str) return str;
  return str.padStart(size).replaceAll(' ', 0)
}

export const getTypeFromToken = (tokenID, uris) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  let uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  if (uriName) uriName = xrpl.convertHexToString(uriName);
  return uriName ? unPad(decodeHashURI(uriName + '').type) : uriName;
}
export const getDateFromToken = (tokenID, uris, showHours=true) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  let uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  if (uriName) uriName = xrpl.convertHexToString(uriName);
  return uriName ? displayDate(decodeHashURI(uriName + '').date, showHours) : '';
}
export const getAddrFromToken = (tokenID, uris) => {
  const uriFiltered = uris.filter((e) => e.properties.nftToken == tokenID);
  let uriName = uriFiltered && uriFiltered[0] ? uriFiltered[0].name : '';
  if (uriName) uriName = xrpl.convertHexToString(uriName);
  return uriName ? decodeHashURI(uriName + '').address : '';
}

// nfts: Nfts[]
// profile: farmer/cook/manager
// isDistinct: bool, if true, dont count same token
// ret: number of tokens for profile
export const countTokenFromProfile = (nfts, profile, isDistinct) => {
  const arrayOfType = [];
  for (let i = 0; i < nfts.length; i++) {
    if (nfts[i].creator === profile) {
      if (isDistinct && arrayOfType.indexOf(nfts[i].type) == -1)
        arrayOfType.push(nfts[i].type);
      else if (!isDistinct)
        arrayOfType.push(nfts[i].type);
    }
  }
  return arrayOfType.length;
} 

// follow path in str to explore data
// ex: data:stateAccount, str:'account.account_data.MintedNFTokens'
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

export const getObjInArray = (arr, field, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][field] === value)
      return arr[i];
  }
}

export const addslashes = (str) => {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

// get list of users [{ address, name, etc }, ]
// ret obj { addr: name }
export const buildNamesList = (users) => {
  if (!users) return [];
  return users.reduce((accum, elt) => {
      accum[elt.address] = elt.name;
      return accum;
    }, {});
}

export const howManyDayBetweenTwoDate = (d1, d2=null) => {
  const date1 = new Date(parseInt(d1 + ''));
  const date2 = d2 ? new Date(parseInt(d2 + '')) : new Date();
  const diff = date1 - date2;
  return Math.abs(diff) / (24 * 60 * 60 * 1000);
}