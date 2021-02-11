import { context } from "./context.ts";

/**
 * Facade layer which translate method callfor Vim/Neovim
 */
export interface Facade {
  /**
   * Execute `expr` command
   */
  command(expr: string): Promise<void>;

  /**
   * Evaluate `expr` and return the result
   */
  eval(expr: string): Promise<unknown>;

  /**
   * Invoke `method` function with params and return the result
   */
  call(method: string, ...params: unknown[]): Promise<unknown>;

  /**
   * Echo string repesentation of the params as debug info
   */
  debug(...params: unknown[]): Promise<unknown>;

  /**
   * Echo string repesentation of the params as an information.
   */
  info(...params: unknown[]): Promise<unknown>;

  /**
   * Echo string repesentation of the params as an error.
   */
  error(...params: unknown[]): Promise<unknown>;

  waitClosed(): Promise<void>;
}

export abstract class AbstractFacade implements Facade {
  abstract command(expr: string): Promise<void>;
  abstract eval(expr: string): Promise<unknown>;
  abstract call(method: string, ...params: unknown[]): Promise<unknown>;
  abstract waitClosed(): Promise<void>;

  async debug(...params: unknown[]): Promise<void> {
    if (!context.debug) {
      return;
    }
    await this.call("denops#debug", ...params.map(ensureReadable));
  }

  async info(...params: unknown[]): Promise<void> {
    await this.call("denops#info", ...params.map(ensureReadable));
  }

  async error(...params: unknown[]): Promise<void> {
    await this.call("denops#error", ...params.map(ensureReadable));
  }
}

function ensureReadable(v: unknown): string {
  return typeof v === "string" ? v : JSON.stringify(v);
}
