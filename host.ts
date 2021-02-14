export type VariableGroup = "g" | "b" | "w" | "t" | "v";

/**
 * A host service interface which denops-deno assume
 */
export interface HostService {
  /**
   * Execute a command (expr) on the host.
   */
  command(expr: string): Promise<void>;

  /**
   * Evaluate an expression (expr) on the host and return the result.
   */
  eval(expr: string): Promise<unknown>;

  /**
   * Call a function on the host and return the result.
   */
  call(fn: string, args: unknown[]): Promise<unknown>;

  /**
   * Echo text on the host.
   */
  echo(text: string): Promise<void>;

  /**
   * Echo text on the host.
   */
  echomsg(text: string): Promise<void>;

  /**
   * Get a (current) variable on Vim script.
   *
   * The group is one of ['g', 'b', 'w', 't', 'v'] which represents
   * global, buffer, window, tabpage, and vim respectively.
   *
   * If you need non current buffer/window/tabpage variable, use
   * 'getbufvar/getwinvar/gettabvar' with 'call()' function.
   */
  getvar(group: VariableGroup, prop: string): Promise<unknown>;

  /**
   * Set a (current) variable on Vim script
   *
   * The group is one of ['g', 'b', 'w', 't', 'v'] which represents
   * global, buffer, window, tabpage, and vim respectively.
   *
   * If you need non current buffer/window/tabpage variable, use
   * 'setbufvar/setwinvar/settabvar' with 'call()' function.
   */
  setvar(group: VariableGroup, prop: string, value: unknown): Promise<void>;
}
