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
 * @param {IRequestOptions} derivedOptions Object to be copied and converted
 * @param {KeyValue[]} parameters Key/value pairs to populate the params map with
 */
export function _convertToRequestOptions (derivedOptions: IRequestOptions, parameters: IKeyValue[]): IRequestOptions {
  const requestOptions: IRequestOptions = Object.assign({ params: {} }, derivedOptions);
  parameters.forEach(({ key, value }) => {
    requestOptions.params[key] = value;
  });
  return requestOptions;
}