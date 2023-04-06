import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Routes from './routes';
import { inDev } from './utils/helpers';
import store from "@store/index";

// Say something
console.log('[RWT] : Execution started.');

//const store = makeStore();

// Application to Render
const app = 
	<Provider store={store}>
		<Routes />
	</Provider>;

// Render application in DOM
ReactDOM.render(app, document.getElementById('app'));

// Hot module replacement
if (inDev() && module.hot) module.hot.accept();