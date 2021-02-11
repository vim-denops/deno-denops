import { Session } from "https://deno.land/x/msgpack_rpc@v2.3/mod.ts";
import { Facade } from "./facade.ts";

export function runPlugin(cmd: string[], facade: Facade): Session {
  const proc = Deno.run({
    cmd,
    stdin: "piped",
    stdout: "piped",
  });
  const session = new Session(proc.stdout, proc.stdin, {
    async command(expr: unknown): Promise<void> {
      if (typeof expr !== "string") {
        throw new Error(`'expr' must be a string`);
      }
      await facade.command(expr);
    },

    async eval(expr: unknown): Promise<unknown> {
      if (typeof expr !== "string") {
        throw new Error(`'expr' must be a string`);
      }
      return await facade.eval(expr);
    },

    async call(method: unknown, ...params: unknown[]): Promise<unknown> {
      if (typeof method !== "string") {
        throw new Error(`'method' must be a string`);
      }
      return await facade.call(method, ...params);
    },

    async debug(...params: unknown[]): Promise<void> {
      await facade.debug(...params);
    },

    async info(...params: unknown[]): Promise<void> {
      await facade.info(...params);
    },

    async error(...params: unknown[]): Promise<void> {
      await facade.error(...params);
    },
  });
  session.listen().catch((err) => {
    console.error("[denops] Plugin server is closed with error:", err);
  });
  return session;
}
