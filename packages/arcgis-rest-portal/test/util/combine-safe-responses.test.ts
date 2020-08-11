import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { _combineSimpleBatchResults } from "../../src/util/combine-simple-batch-results";
import { ISafeResponse } from "../../src/util/send-safe-request";

fdescribe('_combineSimpleBatchResults', () => {

  it('Returns a successful ISafeResponse when all succeed', () => {
    const allSuccessResponses: ISafeResponse[] = [{ success: true }, { success: true }, { success: true }];
    const actualResult: ISafeResponse = _combineSimpleBatchResults(allSuccessResponses);
    const expectedResult: ISafeResponse = { success: true };
    
    expect(actualResult).toEqual(expectedResult)
  });

  it('Returns a failure ISafeResponse with combined errors when some fail', () => {
    const error1 = new ArcGISRequestError('error 1');
    const error2 = new ArcGISRequestError('error 2');

    const someFailureResponses = [
      { success: true }, 
      { success: false, errors: [error1] }, 
      { success: false, errors: [error2] }
    ];

    const actualResult = _combineSimpleBatchResults(someFailureResponses);
    const expectedResult = {
      success: false,
      errors: [error1, error2] 
    }

    expect(actualResult).toEqual(expectedResult)
  });
});