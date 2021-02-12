import { copyBytes, Queue } from "./deps.ts";

export class WorkerWriter implements Deno.Writer {
  #worker: Worker;

  constructor(worker: Worker) {
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
  #worker: Worker;

  constructor(worker: Worker) {
    this.#queue = new Queue();
    this.#worker = worker;
    this.#worker.onmessage = (e: MessageEvent<number[]>) => {
      if (this.#queue) {
        this.#queue.put_nowait(new Uint8Array(e.data));
      }
    };
  }

  async read(p: Uint8Array): Promise<number | null> {
    if (!this.#queue) {
      return await Promise.resolve(null);
    }
    const r = await this.#queue.get();
    const n = copyBytes(r, p);
    return n;
  }

  close(): void {
    this.#queue = undefined;
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
