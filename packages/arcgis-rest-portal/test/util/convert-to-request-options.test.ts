import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IKeyValue, _convertToRequestOptions } from "../../src/util/convert-to-request-options";

interface IDerivedOptions extends IRequestOptions {
  uniqueValue: string;
  anotherValue?: string;
}

describe('_convertToRequestOptions', () => {
  it('Should create a copy of the params that are passed in', () => {
    const derivedOptions: IDerivedOptions = {
      uniqueValue: 'well thats neat!',
      params: {
        'some param': 'a value'
      }
    }
    const result = _convertToRequestOptions(derivedOptions, []);
    expect(result).not.toBe(derivedOptions);
    expect(result).toEqual(derivedOptions);
  });

  it('Should populate params hash with key/values provided', () => {
    const derivedOptions: IDerivedOptions = {
      uniqueValue: 'well thats neat!',
      anotherValue: 'double prizes!',
      params: {
        'some param': 'a value'
      }
    }
    const parameters: IKeyValue[] = [
      { key: 'uniqueValue', value: derivedOptions.uniqueValue },
      { key: 'anotherValue', value: derivedOptions.anotherValue }
    ]

    const result = _convertToRequestOptions(derivedOptions, parameters);

    const expectedParamsHash = {
      'some param': 'a value',
      uniqueValue: 'well thats neat!',
      anotherValue: 'double prizes!',
    }

    expect(result.params).toEqual(expectedParamsHash);
  });
});