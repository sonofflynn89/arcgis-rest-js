
export interface ICombinedBatchResult {
  success: boolean,
  errors?: any[]
}

export interface

/**
 * Reduce simple batch results to a single result object.
 * Results 
 * @param {any[]} results
 * @return {}
 */

export function _combineSimpleBatchResults (results: any[]) {
  const success = results.every(result => result.success);
  const errors = results.reduce((collection, result) => collection.concat(result.errors || []), []);
  const combined = { success };

  if (errors.length > 0) {
    combined.errors = errors;
  }

  return combined;
}