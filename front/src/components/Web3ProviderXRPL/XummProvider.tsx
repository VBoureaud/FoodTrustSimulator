import * as React from 'react';
import { XummPkce } from 'xumm-oauth2-pkce';
import { XummSdkJwt } from "xumm-sdk";

import { ChainList } from "./Web3ProviderXRPLTypes";

type EventPayload = {
	uuid: string
	data: any
	resolve: (resolveData?: unknown) => void,
	payload: any
}

export const handleXummTx = async (
		payload: any,
		onConfirm: Function,
		currentJwt: string,
		onCancel: Function,
		onError?: Function,
) => {
	try {
		const sdk = new XummSdkJwt(currentJwt)
		if (sdk) {
			payload['Account'] = "";// sdk.? todo - account;
			
			const subscription = await sdk.payload.createAndSubscribe(payload, (event:EventPayload) => {
				//console.log('New payload event:', event.data)

				if (event.data.signed === true) {
					if (onConfirm) onConfirm(event.data);
					return event.data
				}

				if (event.data.signed === false) {
					if (onCancel) onCancel();
				}
			})

			return true;
		} else {
			console.log('no valid sdk.');
		}
	}
	catch (err) {
		if (onError) onError(err);
	}
	return false;
}

export const handleXumm = async (
	walletType: string,
	handleWallet: Function,
	appKey: string,
	clientUrl: string,
	chainList?: ChainList[],
	onError?: Function,
	) => {
	try {
		let sdk = null;
		let auth = new XummPkce(appKey);
		
		const xummSignInHandler = (state: any) => {
		  if (state.me) {
		    const { sdk, me } = state;
	
				const serverUrl = me.networkEndpoint;
				const chain = chainList.filter((e: ChainList) => e.url === serverUrl);
				if (!chain.length)
					return false;
				if (handleWallet && me && state.jwt)
					handleWallet(walletType, { address: me.account }, state.jwt, chain[0].name);
		  }
		};
		// To pick up on mobile client redirects:
		auth.on("retrieved", async () => {
		  xummSignInHandler(await auth.state());
		});
		// To pick up on mobile client redirects:
		auth.on("success", async () => {
		  xummSignInHandler(await auth.state());
		});

		auth.authorize().then((session) => {
			xummSignInHandler(session);
	  });

		return true;
	}
	catch (err) {
		if (onError) onError(err);
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