import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

const initState = {};

//create history
export const history = createBrowserHistory({ basename: "/" });

function makeStore(initialState = initState) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares:any = [sagaMiddleware, thunk];
  let composeEnhancers = compose;

  middlewares.push(routerMiddleware(history));

  if (process.env.NODE_ENV === "development") {
    if ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    }

    const loggerMiddleware = createLogger();
    middlewares.push(loggerMiddleware);
  }

  const rootReducerMerged = {
    ...rootReducer,
    router: connectRouter(history),
  };

  const store = createStore(
    compose(combineReducers)(rootReducerMerged),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(rootSaga);

  if ((module as any).hot) {
    (module as any).hot.accept("./reducers", () => {
      const nextReducer = require("./reducers").default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const store = makeStore();

export default store;