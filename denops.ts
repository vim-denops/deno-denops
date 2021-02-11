import {
  Dispatcher,
  Session,
} from "https://deno.land/x/msgpack_rpc@v2.3/mod.ts";

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

  async command(expr: string): Promise<void> {
    await this.#session.call("command", expr);
  }

  async eval(expr: string): Promise<unknown> {
    return await this.#session.call("eval", expr);
  }

  async call(method: string, ...params: unknown[]): Promise<unknown> {
    return await this.#session.call("call", method, ...params);
  }

  async debug(...params: unknown[]): Promise<void> {
    await this.#session.call("debug", ...params);
  }

  async info(...params: unknown[]): Promise<void> {
    await this.#session.call("info", ...params);
  }

  async error(...params: unknown[]): Promise<void> {
    await this.#session.call("error", ...params);
  }

  async waitClosed(): Promise<void> {
    await this.#listener;
  }
}
