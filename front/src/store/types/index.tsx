import { AccountReducerState } from "./AccountTypes";
import { UserReducerState } from "./UserTypes";
import { UriReducerState } from "./UriTypes";
import { NFTReducerState } from "./NftTypes";

export type AppState = {
  accountReducer: AccountReducerState;
  userReducer: UserReducerState;
  uriReducer: UriReducerState;
  nftReducer: NFTReducerState;
};
