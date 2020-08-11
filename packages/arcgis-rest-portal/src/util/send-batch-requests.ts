import { IRequestOptions } from '@esri/arcgis-rest-request';
import { chunk } from "../util/array";
import { ISafeResponse, _sendSafeRequest } from '../util/send-safe-request';

/**
 * @private
 *
 * Batches out AGO requests, delegating to the _sendSafeRequest helper.
 * The options factory function should return the request options for a given batch
 * The response interface (T) should extend ISafeResponse for type safety.
 * 
 * If an error occurs with a batch, the response for that batch will be an
 * ISafeResponse with the success flag set to false and the errors array
 * populated. See _sendSafeRequest for more details.
 * 
 * Example:
 * 
 * interface IMyResponse extends ISafeResponse {
 *  numAdded: number
 * }
 * 
 * const items = ['apple', 'pear', 'orange', 'grape'];
 * 
 * const optionsFactory = (items) => {
 *  return {
 *    params: {
 *      foods: items,
 *      type: 'fruit',
 *    }
 *  }
 * }
 * 
 * const results = await _sendBatchRequests<IMyResponse>('my-url', items, optionsFactory, 2) // Batch Size of 2
 * 
 * const if_all_succeed_result_looks_like = [
 *  { success: true, numAdded: 2 },
 *  { success: true, numAdded: 2 }
 * ]
 * 
 * const if_one_fails_result_looks_like = [
 *  { success: true, numAdded: 2 },
 *  { success: false, errors: [ArcGISRequestError, ...]}
 * ]
 * 
 * 
 * 
 * @param {string} url
 * @param {object[]} items Items to batch
 * @param {(items: any[]) => IRequestOptions} optionsFactory Function that returns the request options to send (invoked for every batch of items)
 * @param {number} size Batch size (defaults to 25)
 *
 * @returns {Promise<any>[]} Promise that resolves to an array of batch responses
 */
export function _sendBatchRequests<T extends ISafeResponse> (
  url: string, 
  items: any[], 
  optionsFactory: (items: any[]) => IRequestOptions, 
  size = 25
): Promise<any[]> {

  const itemBatches: any[][] = chunk<any>(items, size);
  const optionsBatches: IRequestOptions[] = itemBatches.map(optionsFactory);
  const requestPromises: Promise<T>[] = optionsBatches.map(options => _sendSafeRequest(url, options));

  return Promise.all(requestPromises);
}

