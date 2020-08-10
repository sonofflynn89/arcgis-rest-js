import * as RequestModule from "@esri/arcgis-rest-request";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { _sendSafeRequest } from "../../src/util/send-safe-request";

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
    const expectedResult = { success: true };
    paramsSpy.and.callFake(() => Promise.resolve(expectedResult));

    const actualResult = await _sendSafeRequest('fake-url', null);

    expect(actualResult).toEqual(expectedResult);
  });

  it('Returns IErrorResponse with consolidated errors if promise is rejected', async () => {
    const error = 'This is not a drill';
    const expectedResult = { errors: [error] };
    paramsSpy.and.callFake(() => Promise.reject(error));

    const actualResult = await _sendSafeRequest('fake-url', null);

    expect(actualResult).toEqual(expectedResult);
  });
});