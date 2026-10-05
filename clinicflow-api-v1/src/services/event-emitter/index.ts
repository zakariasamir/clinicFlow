import { EventEmitter2 } from "eventemitter2";

let emitter: EventEmitter2 | null = null;

const start = () => {
  emitter = new EventEmitter2({
    wildcard: true,
    delimiter: ".",
    newListener: false,
    maxListeners: 20,
    verboseMemoryLeak: true,
  });
};

const on = (eventType: string, eventHandler: (...args: any[]) => void) => {
  if (emitter) {
    emitter.on(eventType, eventHandler, { async: true });
  }
};

const emit = (eventType: string, eventData?: any) => {
  if (emitter) {
    emitter.emitAsync(eventType, eventData);
  }
};

export default {
  start,
  on,
  emit,
};

export { start, on, emit };
