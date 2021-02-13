import { Dispatcher, Session } from "./deps.ts";
import { WorkerReader, WorkerWriter } from "./worker.ts";

/**
 * A denops host (Vim/Neovim) interface.
 */
export class Denops {
  #name: string;
  #session: Session;

  constructor(
    name: string,
    reader: Deno.Reader & Deno.Closer,
    writer: Deno.Writer,
    dispatcher: Dispatcher = {},
  ) {
    this.#name = name;
    this.#session = new Session(reader, writer, dispatcher);
  }

  /**
   * Start main event-loop of the plugin
   */
  static start(main: (denops: Denops) => Promise<void>): void {
    // deno-lint-ignore no-explicit-any
    const name = (self as any).name ?? "unknown";
    // deno-lint-ignore no-explicit-any
    const worker = (self as any) as Worker;
    const reader = new WorkerReader(worker);
    const writer = new WorkerWriter(worker);
    const denops = new Denops(name, reader, writer);
    const waiter = Promise.all([denops.#session.listen(), main(denops)]);
    waiter.catch((e) => {
      console.error("Unexpected error on denops server", e);
    });
  }

  /**
   * Plugin name
   */
  get name(): string {
    return this.#name;
  }

  /**
   * Execute a command (expr) on the host.
   */
  async command(expr: string): Promise<void> {
    await this.#session.notify("command", expr);
  }

  /**
   * Evaluate an expression (expr) on the host and return the result.
   */
  async eval(expr: string): Promise<unknown> {
    return await this.#session.call("eval", expr);
  }

  /**
   * Call a function on the host and return the result.
   */
  async call(method: string, params: unknown[]): Promise<unknown> {
    return await this.#session.call("call", method, params);
  }

  /**
   * Echo text on the host.
   */
  async echo(text: string): Promise<void> {
    await this.#session.notify("echo", [text]);
  }

  /**
   * Echo text on the host.
   */
  async echomsg(text: string): Promise<void> {
    await this.#session.notify("echomsg", [text]);
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
