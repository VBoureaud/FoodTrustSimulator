import { 
	TYPES_URI,
	RegisterUriPayload,
	GetUrisPayload,
	UrisPayload,
	GetUrisFailurePayload,
	AddUriPayload,
	GetUris,
	GetUrisSuccess,
	GetUrisFailure,
	AddUri,
} from "@store/types/UriTypes";

export function getUris(data: GetUrisPayload): GetUris {
  return {
  	type: TYPES_URI['GET_URI'],
  	payload: data,
  };
};
export function getUrisSuccess(data: UrisPayload): GetUrisSuccess {
  return {
  	type: TYPES_URI['GET_URI_SUCCESS'],
  	payload: data,
  };
};
export function getUrisFailure(data: GetUrisFailurePayload): GetUrisFailure {
  return {
  	type: TYPES_URI['GET_URI_FAILURE'],
  	payload: data,
  };
};

// Add or update new Uri registered
export function addUri(data: AddUriPayload): AddUri {
  return {
  	type: TYPES_URI['ADD'],
  	payload: data,
  };
};