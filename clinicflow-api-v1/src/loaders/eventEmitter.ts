import { EventEmitter2 } from "eventemitter2";

export class DomainEventEmitter extends EventEmitter2 {
  private static instance: DomainEventEmitter;

  private constructor() {
    super({
      wildcard: true,
      delimiter: ".",
      newListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    });
  }

  public static getInstance(): DomainEventEmitter {
    if (!DomainEventEmitter.instance) {
      DomainEventEmitter.instance = new DomainEventEmitter();
    }
    return DomainEventEmitter.instance;
  }
}

export const eventEmitter = DomainEventEmitter.getInstance();

export default function eventEmitterLoader(): DomainEventEmitter {
  console.log("Event Emitter Started!");
  return eventEmitter;
}
