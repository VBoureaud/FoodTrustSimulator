import { routerReducer } from "react-router-redux";

import { accountReducer } from "./AccountReducer";
import { userReducer } from "./UserReducer";
import { nftReducer } from "./NftReducer";
import { uriReducer } from "./UriReducer";

const rootReducer = {
  routing: routerReducer,
  accountReducer,
  userReducer,
  nftReducer,
  uriReducer,
};

export default rootReducer;
