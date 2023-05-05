export const configUrl = {
  frontV1: 'https://foodtrustsimulator.app',
  frontDev: 'https://beta.foodtrustsimulator.app',
  serverV1: 'https://foodtrustserverdev.vercel.app/v1',
  serverDev: 'https://foodtrustserverdev.vercel.app/v1',
  wsUrl: 'ws://localhost:3032',
}

// same on gameengine server
export const configOnChain = [
  {
    color: '#38ff00',
    name: 'Mainnet',
    ready: false,
    url: 'wss://xrplcluster.com',
    faucet: '',
    explorer: 'https://mainnet.xrpl.org/',
  }, {
    color: '#ffef00', 
    name: 'Testnet',
    ready: true,
    url: 'wss://s.altnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
    explorer: 'https://testnet.xrpl.org',
  }, {
    color: '#ffef00', 
    name: 'Devnet',
    ready: false,
    url: 'wss://s.devnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
  }, {
    color: '#ffef00', 
    name: 'AMM-Devnet',
    ready: false,
    url: 'wss://amm.devnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
  }, {
    color: '#ff3000', 
    name: 'XUMM-Testnet',
    ready: true,
    url: 'wss://hooks-testnet-v2.xrpl-labs.com',
    faucet: 'https://hooks-testnet-v2.xrpl-labs.com',
    explorer: 'https://hooks-testnet-v2-explorer.xrpl-labs.com/',
  },
];

export const config = {
  clientURL:
    process.env.NODE_ENV === "development" ? "http://localhost:8080/" : configUrl.frontDev,
  serverURL:
    process.env.NODE_ENV === "development" ? "http://localhost:3002/v1" : configUrl.serverDev,
  wsUrl:
    process.env.NODE_ENV === "development" ? "ws://localhost:3032" : configUrl.wsUrl,
  xrpURL: 'https://s.altnet.rippletest.net:51234',
  xrpWss: 'wss://s.altnet.rippletest.net:51233',
  version: '2.4.5_beta',
  appKey: process.env.NODE_ENV === "development" ? '05430510-45ea-4c11-ae70-a1c87a5e3790'
    : '9765ba32-1bec-4c15-9635-6224929f13b8',// XummConsole Dev or Beta
};

export const navBarTabs = [
  { name: 'Home', path: '/', requireAuth: false },
  { name: 'Play', path: '/play', requireAuth: true },
  { name: 'Collection', path: '/collection', requireAuth: true },
  { name: 'Market', path: '/market', requireAuth: true },
  { name: 'Quest', path: '/quests', requireAuth: true },
  { name: 'Scoreboard', path: '/scoreboard', requireAuth: true },
];

export const navBarUserSettings = [
  { name: 'Profile', link: '/profile' },
  { name: 'Notifications', link: '/notifications' },
  { name: 'Faq', link: '/faq' },
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
  deleteUri: { url: config.serverURL + "/uri/", method: "DELETE" },
  getParents: { url: config.serverURL + "/uri/parents/", method: "GET" },
  createAd: { url: config.serverURL + "/user/createAd", method: "POST" },
  logoutUser: { url: config.serverURL + "/user/logout", method: "GET" },
};
