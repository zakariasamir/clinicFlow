import asyncHooks from "async_hooks";
import crypto from "crypto";

const store = new Map<number, any>();

const asyncHook = asyncHooks.createHook({
  init: (asyncId, _, triggerAsyncId) => {
    if (store.has(triggerAsyncId)) {
      store.set(asyncId, store.get(triggerAsyncId));
    }
  },
  destroy: (asyncId) => {
    if (store.has(asyncId)) {
      store.delete(asyncId);
    }
  },
});

asyncHook.enable();

const createRequestContext = (data?: any, requestId = crypto.randomUUID()) => {
  const requestInfo = { requestId, data: data || {} };
  store.set(asyncHooks.executionAsyncId(), requestInfo);
  return requestInfo;
};

const getRequestContext = () => store.get(asyncHooks.executionAsyncId());

export default {
  start: () => {},
  createRequestContext,
  getRequestContext,
};

export { createRequestContext, getRequestContext };
