import { AsyncLocalStorage } from "async_hooks";

export interface RequestContextData {
  requestId?: string;
  originalUrl?: string;
  currentUser?: {
    id: string;
    email: string;
    role: "ADMIN" | "STAFF";
    fullName: string;
  };
}

class AsyncHookService {
  private storage: AsyncLocalStorage<RequestContextData>;

  constructor() {
    this.storage = new AsyncLocalStorage<RequestContextData>();
  }

  public start(): void {
    // Singleton initialization
  }

  public runWithContext(context: RequestContextData, callback: () => void): void {
    this.storage.run(context, callback);
  }

  public getContext(): RequestContextData | undefined {
    return this.storage.getStore();
  }

  public getCurrentUser() {
    return this.storage.getStore()?.currentUser;
  }

  public getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }
}

export const AsyncHook = new AsyncHookService();
export default AsyncHook;
