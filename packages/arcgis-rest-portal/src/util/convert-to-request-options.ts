import { IRequestOptions } from "@esri/arcgis-rest-request";

export interface IKeyValue {
  key: string,
  value: any,
}

/**
 * @private
 *
 * Converts derived interfaces of IRequestOptions to its base interface.
 * Makes a copy of inherited properties and populates the params map
 * with specified key/values.
 * 
 * Example:
 * 
 * interface IDerivedOptions extends IRequestOptions {
 *  uniqueValue: string;
 *  anotherValue?: string;
 * }
 * 
 * const derivedOptions: IDerivedOptions = {
 *     uniqueValue: 'well thats neat!',
 *     anotherValue: 'double prizes!',
 *     hideToken: true, // Inherited Property
 *     params: {
 *       'some param': 'a value'
 *     }
 * }
 * 
 * const parameters: IKeyValue[] = [
 *   { key: 'uniqueValue', value: derivedOptions.uniqueValue },
 *   { key: 'anotherValue', value: derivedOptions.anotherValue }
 * ]
 *
 * const result = _convertToRequestOptions(derivedOptions, parameters);
 *
 * const result_should_look_like_this = {
 *  uniqueValue: 'well thats neat!',
 *  anotherValue: 'double prizes!',
 *  hideToken: true,
 *  params: {
 *    'some param': 'a value',
 *     uniqueValue: 'well thats neat!',
 *     anotherValue: 'double prizes!',
 *  }
 * }
 * 
 * 
 *
 * @param {IRequestOptions} derivedOptions Object to be copied and converted
 * @param {KeyValue[]} parameters Key/value pairs to populate the params map with
 * 
 * @returns {IRequestOptions} An IRequestOptions with a populated params map
 */
export function _convertToRequestOptions (derivedOptions: IRequestOptions, parameters: IKeyValue[]): IRequestOptions {
  const requestOptions: IRequestOptions = Object.assign({ params: {} }, derivedOptions);
  parameters.forEach(({ key, value }) => {
    requestOptions.params[key] = value;
  });
  return requestOptions;
}