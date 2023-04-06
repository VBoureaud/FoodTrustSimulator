import * as React from 'react';
import { isConnected, getAddress, getPublicKey, getNetwork /*, sendPayment */ } from "@gemwallet/api";
import { ChainList } from "./Web3ProviderXRPLTypes";

//const getPublicKey = () => { return false };

export const handleGemTx = async (payload: any, onConfirm: Function) => {
	const co = await isConnected();
	// console.log({ co });
	if (!co) return false;
	const pub = await getAddress();
	if (pub) {
		// onConfirm(pub);
		// const pay = await sendPayment(payload);
		// console.log({ pay });
	}
	return false;
}

export const handleGem = async (walletType: string, handleWallet: Function, handleNoGem: Function, chainList: ChainList[]) => {
  /*console.log('handleGem');
  console.log({ chainList });*/
  
  // Wait for fix from GemWallet
  handleNoGem(true, `GemWallet not yet available, please try another one.`);
	return true;

  handleNoGem(false);
	const co = await isConnected();
	//console.log({ co });
	
	if (co) {
		try {
			// check server available
			const server = await getNetwork();
			// console.log({ server });

			const chains = chainList.filter(e => e.name == server);
			// console.log({ chains });
			
			if (chains.length === 0) {
				handleNoGem(true, `Application not available on ${server}, please try another one.`);
				return true;
			}

			// ask for permission
			const pubAddr = await getAddress();
			// console.log({ pubAddr });

			if (pubAddr && handleWallet)
				handleWallet(walletType, { address: pubAddr }, null, chains[0].url);
		} catch (err) {
			// console.log({err});
		}
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