import * as RequestModule from "@esri/arcgis-rest-request";
import { ArcGISRequestError, IRequestOptions } from "@esri/arcgis-rest-request";
import { ISafeResponse, _sendSafeRequest } from "../../src/util/send-safe-request";

describe('_sendSafeRequest', () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(RequestModule, 'request');
  });

  afterEach(() => {
    paramsSpy.calls.reset();
  })

  it('Properly delegates to @esri/arcgis-rest-request\'s request method', () => {
    paramsSpy.and.callFake(() => Promise.resolve());
    const url = 'fake-url';
    const ro: IRequestOptions = {
      params: {
        key: 'value'
      }
    }

    _sendSafeRequest(url, ro);

    expect(paramsSpy).toHaveBeenCalledWith(url, ro);
  });

  it('Returns response of delegated method if promise is not rejected', async () => {
    interface IMyResponse extends ISafeResponse {
      name: string,
      age: number
    }

    const expectedResult: IMyResponse = { success: true, name: 'Mickey Mouse', age: 95 };
    paramsSpy.and.callFake(() => Promise.resolve(expectedResult));

    const actualResult = await _sendSafeRequest('fake-url', null);

    expect(actualResult).toEqual(expectedResult);
  });

  it('Returns ISafeResponse with consolidated errors if promise is rejected', async () => {
    const error = new ArcGISRequestError('This is not a drill');
    const expectedResult: ISafeResponse = { success: false, errors: [error] };
    paramsSpy.and.callFake(() => Promise.reject(error));

    const actualResult = await _sendSafeRequest('fake-url', null);

    expect(actualResult).toEqual(expectedResult);
  });
});