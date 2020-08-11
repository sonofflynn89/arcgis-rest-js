import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import { ISafeResponse } from './send-safe-request';

/**
 * @private
 * 
 * Reduce array of ISafeResponse to a single ISafeResponse with 
 * combined errors and success flag set accordingly.
 * 
 * Example:
 * 
 * // All Successes
 * const allSuccessResponses = [{ success: true }, { success: true }, { success: true }];
 * const result = _combineSimpleBatchResults(allSuccessResponse);
 * const result_should_look_like = { success: true }
 * 
 * // Some Failures
 * const someFailureResponses = [
 *  { success: true }, 
 *  { success: false, errors: [error1] }, 
 *  { success: false, errors: [error2] }
 * ];
 * const result = _combineSimpleBatchResults(someFailureResponses);
 * const result_should_look_like = {
 *  success: false,
 *  errors: [error1, error2] 
 * }
 *  
 * @param {ISafeResponse[]} responses
 * @return {ISafeResponse}
 */

 // TODO: rename to _combineSafeResponses
export function _combineSafeResponses(responses: ISafeResponse[]): ISafeResponse {
  const success = responses.every(res => res.success);
  const errors: ArcGISRequestError[] = responses.reduce((collection, res) => collection.concat(res.errors || []), []);
  const combined: ISafeResponse = { success };

  if (errors.length > 0) {
    combined.errors = errors;
  }

  return combined;
}