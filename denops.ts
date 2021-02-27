import {
  Dispatcher,
  DispatcherFrom,
  Session,
  WorkerReader,
  WorkerWriter,
} from "./deps.ts";
import { Api, Context } from "./api.ts";
import { getCacheOrElse } from "./cache.ts";

/**
 * Denops provides API to access plugin host (Vim/Neovim)
 */
export class Denops implements Api {
  #name: string;
  #session: Session;

  private constructor(
    name: string,
    reader: Deno.Reader & Deno.Closer,
    writer: Deno.Writer,
    dispatcher: Dispatcher = {},
  ) {
    this.#name = name;
    this.#session = new Session(reader, writer, dispatcher);
  }

  /**
   * Get thread-local denops instance
   */
  static get(): Denops {
    return getCacheOrElse("denops", () => {
      // deno-lint-ignore no-explicit-any
      const worker = self as any;
      const reader = getCacheOrElse(
        "workerReader",
        () => new WorkerReader(worker),
      );
      const writer = getCacheOrElse(
        "workerWriter",
        () => new WorkerWriter(worker),
      );
      return new Denops(worker.name, reader, writer);
    });
  }

  /**
   * Start main event-loop of the plugin
   */
  static start(main: (denops: Denops) => Promise<void>): void {
    const denops = Denops.get();
    const waiter = Promise.all([denops.#session.listen(), main(denops)]);
    waiter.catch((e) => {
      console.error(`Unexpected error occured in '${denops.name}'`, e);
    });
  }

  /**
   * Plugin name
   */
  get name(): string {
    return this.#name;
  }

  async cmd(cmd: string, context: Context = {}): Promise<void> {
    await this.#session.call("cmd", cmd, context);
  }

  async eval(expr: string, context: Context = {}): Promise<unknown> {
    return await this.#session.call("eval", expr, context);
  }

  async call(func: string, ...args: unknown[]): Promise<unknown> {
    return await this.#session.call("call", func, ...args);
  }

  /**
   * Extend dispatcher of the internal msgpack_rpc session
   */
  extendDispatcher(dispatcher: Dispatcher): void {
    this.#session.extendDispatcher(dispatcher);
  }

  /**
   * Clear dispatcher of the internal msgpack_rpc session
   */
  clearDispatcher(): void {
    this.#session.clearDispatcher();
  }
}

// Re-export
export type { Dispatcher, DispatcherFrom };
