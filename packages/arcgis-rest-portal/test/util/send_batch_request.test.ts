import { _sendBatchRequests } from "../../src/util/send-batch-requests";
import * as sendSafeRequestModule from "../../src/util/send-safe-request";
import * as chunkModule from "../../src/util/array";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe('_sendBatchRequests', () => {
  let sendSafeRequestSpy: jasmine.Spy;
  let chunkSpy: jasmine.Spy;

  beforeEach(() => {
    sendSafeRequestSpy = spyOn(sendSafeRequestModule, '_sendSafeRequest');
    chunkSpy = spyOn(chunkModule, 'chunk');
  });

  afterEach(() => {
    sendSafeRequestSpy.calls.reset();
    chunkSpy.calls.reset();
  });

  it('Defaults to batches of 25', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake((items: any) => ([items]));
    const optionsFactory: () => any = () => null;
    const items: any[] = [];

    await _sendBatchRequests<sendSafeRequestModule.ISafeResponse>('fake-url', items, optionsFactory)
    expect(chunkSpy).toHaveBeenCalledWith(items, 25);
  });

  it('Respects batch size overrides', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake((items: any) => ([items]));
    const optionsFactory: () => any = () => null;
    const items: any[] = [];

    await _sendBatchRequests<sendSafeRequestModule.ISafeResponse>('fake-url', items, optionsFactory, 2)
    expect(chunkSpy).toHaveBeenCalledWith(items, 2);
  });

  it('Invokes the optionsFactory for every batch', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake(() => ([['this'], ['is'], ['sparta']]));
    let optionsFactoryInvocations = 0;
    const optionsFactory: () => any = () => {
      optionsFactoryInvocations++
      return null;
    };
    const items: any[] = [];

    await _sendBatchRequests<sendSafeRequestModule.ISafeResponse>('fake-url', items, optionsFactory);
    expect(optionsFactoryInvocations).toEqual(3)
  });

  it('Properly delegates to _sendSafeRequest for every batch', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake(() => (['this', 'is', 'sparta']));
    const thisOptions: any = { item: 'this' };
    const isOptions: any = { item: 'is' };
    const spartaOptions: any = { item: 'sparta' };
    const optionsFactory: (items: any) => any = (items: any) => {
      switch(items) {
        case 'this': 
          return thisOptions;
        case 'is':
          return isOptions;
        case 'sparta': 
          return spartaOptions;
        default:
          return null;
      }
    };
    const items: any[] = [];

    await _sendBatchRequests<sendSafeRequestModule.ISafeResponse>('fake-url', items, optionsFactory);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', thisOptions);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', isOptions);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', spartaOptions);
  });

  it('Returns a promise that resolves to an array of responses (one for each batch)', async () => {
    interface IMyResponse extends sendSafeRequestModule.ISafeResponse {
      numAdded: number
    }
      
    const items: any = ['apple', 'pear', 'orange', 'grape'];
    
    const optionsFactory: (items: any) => IRequestOptions = (items) => {
      return {
        params: {
          foods: items,
          type: 'fruit',
        }
      }
    }

    chunkSpy.and.callFake(() => ([['apple', 'pear'], ['orange', 'grape']]));
    sendSafeRequestSpy.and.callFake(() => Promise.resolve({ success: true, numAdded: 2 }));
    
    const actualResults: IMyResponse[] = await _sendBatchRequests<IMyResponse>('my-url', items, optionsFactory, 2) // Batch Size of 2
    
    const expectedResults = [
      { success: true, numAdded: 2 },
      { success: true, numAdded: 2 }
    ];

    expect(actualResults).toEqual(expectedResults);
  
  });
});