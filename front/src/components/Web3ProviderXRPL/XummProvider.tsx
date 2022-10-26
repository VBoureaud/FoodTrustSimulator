import * as React from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';
import { XummSdkJwt } from "xumm-sdk";

type EventPayload = {
	uuid: string
	data: any
	resolve: (resolveData?: unknown) => void,
	payload: any
}

export const handleXummTx = async (payload: any, onConfirm: Function, currentJwt: string, onCancel: Function) => {
	try {
		const sdk = new XummSdkJwt(currentJwt)
		if (sdk) {
			payload['Account'] = "";// sdk.? todo - account;
			// console.log({ payload });

			const subscription = await sdk.payload.createAndSubscribe(payload, (event:EventPayload) => {
				// console.log('New payload event:', event.data)

				if (event.data.signed === true) {
					if (onConfirm) onConfirm(event.data);
					return event.data
				}

				if (event.data.signed === false) {
					if (onCancel) onCancel()
				}
			})

			//console.log({ subscription });
			return true;
		} else {
			// console.log('no valid sdk.');
		}
	}
	catch (err) {
		// console.log({ err });
	}
	return false;
}

export const handleXumm = async (
	walletType: string,
	handleWallet: Function,
	appKey: string,
	clientUrl: string,
	) => {
	try {
		let sdk = null;
		let auth = new XummPkce(appKey, clientUrl);
		
		auth.on('result', () => {
			// Redirect, e.g. mobile. Mobile may return to new tab, this
			// handles the same logic (re-inits the auth Promise) normally
			// triggered by e.g. a button.
			//   > Note: it emulates without opening another auth window ;)
			console.log('Results are in, mobile flow, emulate auth trigger')
		})

		const authorized = await auth.authorize();

		sdk = authorized.sdk;
		if (handleWallet && authorized.me)
			handleWallet(walletType, { address: authorized.me.account }, authorized.jwt);
		return true;
	}
	catch (err) {
		return false;
	}
};

type XummProviderProps = {
}
const XummProvider : React.FunctionComponent<XummProviderProps> = (props) => {
	return (
		<div>
			XummProvider
		</div>
	);
}

export default XummProvider;