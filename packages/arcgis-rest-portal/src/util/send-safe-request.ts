import { ArcGISRequestError, IRequestOptions, request } from '@esri/arcgis-rest-request';

export interface SimpleArcGISResponse {
  success: boolean,
  errors?: ArcGISRequestError[];
}

/**
 * @private
 *
 * Sends a request to AGO. If successful, the response is propagated back to the caller.
 * If the request fails, a SimpleArcGISResponse object is passed back with the relevant errors.
 * 
 * @param {string} url
 * @param {IRequestOptions} requestOptions
 *
 * @returns {Promise<T> | Promise<SimpleArcGISResponse>} endpoint's response or errors
 */
export function _sendSafeRequest<T>(url: string, requestOptions: IRequestOptions): Promise<T> | Promise<SimpleArcGISResponse> {
  return request(url, requestOptions).catch((error: any) => ({ success: false, errors: [error] }));
}