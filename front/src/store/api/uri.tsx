import { buildRequest } from "@utils/helpers";
import { apiServer } from "@config";
import { 
	RegisterUriPayload,
	GetUrisPayload,
	UpdateUrisPayload,
	DeleteUriPayload,
} from "@store/types/UriTypes";
import { 
	GetParentsPayload,
} from "@store/types/NftTypes";

export const registerUri = async (data: RegisterUriPayload)  => {
	try {
  	const res = await buildRequest(
	    apiServer.registerUri.url,
	    apiServer.registerUri.method,
	    data,
	  );
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

//todo limit 
export const queryUris = (data: GetUrisPayload) => {
  const name = data && data.name ? "&name=" + encodeURIComponent(data.name) : '';
  const nftToken = data && data.nftToken ? "&nftToken=" + encodeURIComponent(data.nftToken) : '';
  const address = data && data.address ? "&address=" + encodeURIComponent(data.address) : '';
  const url = apiServer.queryUris.url + '?limit=100' + name + nftToken + address;
  return buildRequest(
    url,
    apiServer.queryUris.method,
  );
};

export const deleteUri = async (data: DeleteUriPayload)  => {
	try {
  	const res = await buildRequest(
	    apiServer.deleteUri.url + data.name_to_delete,
	    apiServer.deleteUri.method,
	    {
	    	owner: data.owner,
	    },
	  );
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const updateUri = async (data: UpdateUrisPayload)  => {
	try {
  	const res = await buildRequest(
	    apiServer.updateUri.url + data.name,
	    apiServer.updateUri.method,
	    {
	    	owner: data.owner,
	    	offer: data.offer,
	    	action: data.action,
	    },
	  );
		return res;
	} catch (error) {
		throw new Error(error);
	}
};

export const getParents = async (data: GetParentsPayload)  => {
	try {
  	const res = await buildRequest(
	    apiServer.getParents.url + data.name,
	    apiServer.getParents.method,
	  );
		return res;
	} catch (error) {
		throw new Error(error);
	}
};