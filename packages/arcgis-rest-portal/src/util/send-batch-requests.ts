import { IRequestOptions } from '@esri/arcgis-rest-request';
import { chunk } from "../util/array";
import { _sendSafeRequest } from '../util/send-safe-request';

/**
 * @private
 *
 * Batches out AGO requests, delegating to the _sendSafeRequest helper.
 * If any requests fail, the array returned will include a Promise<IErrorResponse>.
 * 
 * @param {string} url
 * @param {any[]} items Items to batch
 * @param {(items: any) => IRequestOptions} optionsFactory Function that returns the request options to send (invoked for every batch of items)
 * @param {number} size Batch size (defaults to 25)
 *
 * @returns {Promise<any[]>} Promise that resolves to an array of responses
 */
export function _sendBatchRequests (url: string, items: any[], optionsFactory: (items: any)=> IRequestOptions, size = 25) {
  const itemBatches: any[][] = chunk<any>(items, size);
  const optionsBatches: IRequestOptions[] = itemBatches.map(optionsFactory);
  const requestPromises = optionsBatches.map(options => _sendSafeRequest(url, options));

  return Promise.all(requestPromises);
}

