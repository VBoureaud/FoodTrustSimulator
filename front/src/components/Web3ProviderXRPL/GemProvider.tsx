import * as React from 'react';
import { isConnected, /* getPublicKey, sendPayment */ } from "@gemwallet/api";

const getPublicKey = () => { return false };

// todo handle when no GemWallet
export const handleGemTx = async (payload: any, onConfirm: Function) => {
	const co = await isConnected();
	console.log({ co });
	if (!co) return false;
	const pub = await getPublicKey();
	if (pub) {
		// onConfirm(pub);
		// const pay = await sendPayment(payload);
		// console.log({ pay });
	}
	return false;
}

export const handleGem = async (walletType: string, handleWallet: Function, handleNoGem: Function) => {
  handleNoGem(false);
	const co = await isConnected();
	if (co) {
		const pub = await getPublicKey();
		if (pub && handleWallet)
			handleWallet(walletType, pub);
	} else {
  	handleNoGem(!co);
  }
  return true;
}

type GemProviderProps = {
}
const GemProvider : React.FunctionComponent<GemProviderProps> = (props) => {
	return (
		<div>
			Hello
		</div>
	);
}

export default GemProvider;