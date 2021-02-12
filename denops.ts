import { Dispatcher, Session } from "./deps.ts";

/**
 * A denops host (Vim/Neovim) interface.
 */
export class Denops {
  #session: Session;
  #listener: Promise<void>;

  constructor(
    dispatcher: Dispatcher,
    reader: Deno.Reader & Deno.Closer = Deno.stdin,
    writer: Deno.Writer = Deno.stdout,
  ) {
    this.#session = new Session(reader, writer, dispatcher);
    this.#listener = this.#session.listen();
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
   * Output string representation of params on the host.
   *
   * This does nothing if debug mode of the denops is not enabled by users.
   */
  async debug(...params: unknown[]): Promise<void> {
    await this.#session.call("debug", ...params);
  }

  /**
   * Output string representation of params on the host as an info.
   */
  async info(...params: unknown[]): Promise<void> {
    await this.#session.call("info", ...params);
  }

  /**
   * Output string representation of params on the host as an error.
   */
  async error(...params: unknown[]): Promise<void> {
    await this.#session.call("error", ...params);
  }

  /**
   * Wait until the host is closed
   */
  async waitClosed(): Promise<void> {
    await this.#listener;
  }
}
