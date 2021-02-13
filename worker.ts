import { copyBytes, Queue } from "./deps.ts";

type WorkerForWorkerWriter = {
  postMessage(message: number[]): void;
};

type WorkerForWorkerReader = {
  onmessage(message: MessageEvent<number[]>): void;
  terminate(): void;
};

export class WorkerWriter implements Deno.Writer {
  #worker: WorkerForWorkerWriter;

  constructor(worker: WorkerForWorkerWriter) {
    this.#worker = worker;
  }

  write(p: Uint8Array): Promise<number> {
    // XXX
    // Send 'p' as-is once the issue below has resolved.
    // https://github.com/denoland/deno/issues/3557
    this.#worker.postMessage(Array.from(p));
    return Promise.resolve(p.length);
  }
}

export class WorkerReader implements Deno.Reader, Deno.Closer {
  #queue?: Queue<Uint8Array>;
  #closed: boolean;
  #worker: WorkerForWorkerReader;

  constructor(worker: WorkerForWorkerReader) {
    this.#queue = new Queue();
    this.#closed = false;
    this.#worker = worker;
    this.#worker.onmessage = (e: MessageEvent<number[]>) => {
      if (this.#queue && !this.#closed) {
        this.#queue.put_nowait(new Uint8Array(e.data));
      }
    };
  }

  async read(p: Uint8Array): Promise<number | null> {
    if (!this.#queue || (this.#closed && this.#queue.empty())) {
      this.#queue = undefined;
      return await Promise.resolve(null);
    }
    const r = await this.#queue.get();
    const n = copyBytes(r, p);
    return n;
  }

  close(): void {
    this.#closed = true;
    this.#worker.terminate();
  }
}

/**
 * Check if the self is DedicatedWorkerGlobalScope
 *
 * Note that Deno 1.7.2 does not provide the interface of DedicatedWorkerGlobalScope
 * thus the Worker is used instead to type self.
 */
export function isDedicatedWorkerGlobalScope(self: unknown): self is Worker {
  // deno-lint-ignore no-explicit-any
  const aself = self as any;
  return (
    !!aself &&
    typeof aself.close === "function" &&
    typeof aself.postMessage === "function"
  );
}
