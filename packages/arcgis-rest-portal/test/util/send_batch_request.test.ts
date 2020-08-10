import { _sendBatchRequests } from "../../src/util/send-batch-requests";
import * as sendSafeRequestModule from "../../src/util/send-safe-request";
import * as chunkModule from "../../src/util/array";

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

    await _sendBatchRequests('fake-url', items, optionsFactory)
    expect(chunkSpy).toHaveBeenCalledWith(items, 25);
  });

  it('Respects batch size overrides', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake((items: any) => ([items]));
    const optionsFactory: () => any = () => null;
    const items: any[] = [];

    await _sendBatchRequests('fake-url', items, optionsFactory, 2)
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

    await _sendBatchRequests('fake-url', items, optionsFactory);
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

    await _sendBatchRequests('fake-url', items, optionsFactory);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', thisOptions);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', isOptions);
    expect(sendSafeRequestSpy).toHaveBeenCalledWith('fake-url', spartaOptions);
  });

  it('Returns a promise that resolves to an array of responses (one for each batch)', async () => {
    sendSafeRequestSpy.and.callFake(() => Promise.resolve());
    chunkSpy.and.callFake(() => (['this', 'is', 'sparta']));
    const optionsFactory: (items: any) => any = () => null
    const items: any[] = [];

    const result = await _sendBatchRequests('fake-url', items, optionsFactory);
    expect(result.length).toEqual(3);
  });
});