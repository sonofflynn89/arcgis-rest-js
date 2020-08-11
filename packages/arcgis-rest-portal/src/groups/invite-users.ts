import { getPortalUrl } from '../util/get-portal-url';
import { IKeyValue, _convertToRequestOptions } from '../util/convert-to-request-options';
import { _sendBatchRequests } from '../util/send-batch-requests';
import { IRequestOptions } from '@esri/arcgis-rest-request';
import { _combineSafeResponses } from '../util/combine-safe-responses';
import { ISafeResponse } from '../util/send-safe-request';

export interface IInviteGroupUsersOptions extends IRequestOptions {
  id: string;
  users: string[];
  role: string;
  expiration: number
}

/**
 * Invites users to join a group. Operation success
 * will be indicated by a flag on the return
 * object. If there are any errors, they will be
 * placed in an errors array on the return object
 * 
 * Example:
 * 
 * const authentication: IAuthenticationManager; // Typically passed into to the function
 * 
 * const options: IInviteGroupUsersOptions = {
 *  id: 'group_id',
 *  users: ['ed', 'edd', 'eddy'],
 *  role: 'group-member',
 *  expiration: 20160,
 *  authentication
 * }
 * 
 * const result = await inviteGroupUsers(options);
 * 
 * const if_success_result_looks_like = {
 *  success: true
 * }
 * 
 * const if_failure_result_looks_like = {
 *  success: false,
 *  errors: [ArcGISRequestError]
 * }
 * 
 * @param {IInviteGroupUsersOptions} options
 *
 * @returns {Promise<ISafeResponse>} 
 */
export function inviteGroupUsers(options: IInviteGroupUsersOptions): Promise<ISafeResponse> {
  const id = options.id;
  const url = `${getPortalUrl(options)}/community/groups/${id}/invite`;
  const requestOptionParams: IKeyValue[] = [
    { key: 'role', value: options.role },
    { key: 'expiration', value: options.expiration }
  ];
  const requestOptions = _convertToRequestOptions(options, requestOptionParams);
  const requestOptionsFactory = _getROFactory(requestOptions);
  
  return _sendBatchRequests<ISafeResponse>(url, options.users, requestOptionsFactory)
    .then(_combineSafeResponses);
}

/**
 * @private
 */
export function _getROFactory(baseRO: IRequestOptions): (items: any) => IRequestOptions {
  const requestOptionsFactory = (users: any[]): IRequestOptions => {
    const paramsCopy = Object.assign({}, baseRO.params);
    const optionsCopy = Object.assign({}, baseRO, { params: paramsCopy });
    optionsCopy.params.users = users;

    return optionsCopy;
  };

  return requestOptionsFactory;
}