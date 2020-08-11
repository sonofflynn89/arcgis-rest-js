import { ArcGISRequestError, IRequestOptions, request } from '@esri/arcgis-rest-request';

// TODO: Rename this to ISafeResponse
export interface ISafeResponse {
  success: boolean,
  errors?: ArcGISRequestError[];
}

/**
 * @private
 *
 * Sends a request to AGO. If successful, the response is propagated back to the caller 
 * with the success flag set to true If the request fails, a ISafeResponse object is 
 * passed back with the relevant errors and the success flag set to false.
 * 
 * To avoid duplication for type safety, have the response interface extend ISafeResponse.
 * 
 * Example:
 * 
 * interface IMyResponse extends ISafeResponse {
 *  someCoolProperty: string,
 * }
 * 
 * const ro: IRequestOptions = {
 *  params: {
 *    foo: true
 *  }
 * }
 * 
 * const result: IMyResponse = await _sendSafeRequest('my-url', ro);
 * 
 * const if_success_result_looks_like: IMyResponse = {
 *   success: true,
 *   someCoolProperty: 'server-response'
 * }
 * 
 * const if_failure_result_looks_like: ISafeResponse = {
 *    success: false,
 *    errors: [ArgGISRequestError, ...]
 * }
 * 
 * @param {string} url
 * @param {IRequestOptions} requestOptions
 *
 * @returns {Promise<any>} Promise that resolves to endpoint's response or errors
 */
export function _sendSafeRequest(
  url: string, 
  requestOptions: IRequestOptions
): Promise<any> {
  return request(url, requestOptions)
  .then(result => Object.assign({ success: true }, result))
  .catch((error: any) => {
    return { 
      success: false, 
      errors: [error] 
    }
  });
}