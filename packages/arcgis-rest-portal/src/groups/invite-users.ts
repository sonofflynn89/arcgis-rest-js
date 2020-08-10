import { getPortalUrl } from '../util/get-portal-url';
import { _convertToRequestOptions } from '../util/convert-to-request-options';
import { _sendBatchRequests } from '../util/send-batch-requests';

/**
 * Invites users to join a group
 *
 * TODO: Add Interfaces
 * @param {object} options
 *
 * @returns {object}
 */
export function inviteGroupUsers (options) {
  const id = options.id;
  const url = `${getPortalUrl(options)}/community/groups/${id}/invite`;
  const requestOptionParams = [
    { key: 'role', value: options.role },
    { key: 'expiration', value: options.expiration }
  ];
  const requestOptions = _convertToRequestOptions(options, requestOptionParams);

  const requestOptionsFactory = (users: any[]) => {
    const paramsCopy = Object.assign({}, requestOptions.params);
    const optionsCopy = Object.assign({}, requestOptions, { params: paramsCopy });
    optionsCopy.params.users = users;

    return optionsCopy;
  };

  return _sendBatchRequests(url, options.users, requestOptionsFactory).then(_combineSimpleBatchResults);
}