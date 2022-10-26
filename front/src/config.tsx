export const configUrl = {
  frontV1: 'https://foodtrustsimulator.app',
  frontDev: 'https://dev.foodtrustsimulator.app',
  serverV1: 'https://fdtrsmltpoj.herokuapp.com/v1',
  serverDev: 'https://devfdtrsmltpoj.herokuapp.com/v1',
}

export const config = {
  clientURL:
    process.env.NODE_ENV === "development" ? "http://localhost:8080/" : configUrl.frontDev,
  serverURL:
    process.env.NODE_ENV === "development" ? "http://localhost:3002/v1" : configUrl.serverDev,
  xrpURL: 'http://xls20-sandbox.rippletest.net:51234',
  //xrpWss: 'wss://xls20-sandbox.rippletest.net:51233',
  xrpWss: 'wss://hooks-testnet-v2.xrpl-labs.com',
  version: '1.0.2',
  //faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
  faucet: 'https://hooks-testnet-v2.xrpl-labs.com',
  appKey: '05430510-45ea-4c11-ae70-a1c87a5e3790',
};

export const navBarTabs = [
  { name: 'Home', path: '/', requireAuth: false },
  { name: 'Play', path: '/play', requireAuth: true },
  { name: 'Collection', path: '/collection', requireAuth: true },
  { name: 'Market', path: '/market', requireAuth: true },
];

export const navBarUserSettings = [
  { name: 'Profile', link: '/profile' },
  { name: 'Logout', link: '/' },
];

export const apiServer = {
  register: { url: config.serverURL + "/user", method: "POST" },
  getUser: { url: config.serverURL + "/user", method: "GET" },
  patchUser: { url: config.serverURL + "/user", method: "PATCH" },
  deleteUser: { url: config.serverURL + "/user", method: "DELETE" },
  getAll: { url: config.serverURL + "/user/all", method: "GET" },
  getCities: { url: config.serverURL + "/cities/", method: "GET" },
  queryUris: { url: config.serverURL + "/uri", method: "GET" },
  registerUri: { url: config.serverURL + "/uri", method: "POST" },
  updateUri: { url: config.serverURL + "/uri/", method: "PATCH" },
  getHistory: { url: config.serverURL + "/uri/history", method: "GET" },
};
