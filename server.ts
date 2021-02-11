import { Session } from "https://deno.land/x/msgpack_rpc@v2.3/mod.ts";
import { createVim } from "./facade/vim.ts";
import { createNeovim } from "./facade/neovim.ts";
import { runPlugin } from "./plugin.ts";
import { context } from "./context.ts";

export interface ServerOptions {
  mode?: "vim" | "neovim";
  debug?: boolean;
}

export async function startServer(options: ServerOptions = {}): Promise<void> {
  Object.assign(context, {
    mode: options.mode,
    debug: options.debug,
  });
  const createFacade = options.mode === "vim" ? createVim : createNeovim;
  const pluginRegistry: { [key: string]: Session } = {};
  const facade = createFacade(Deno.stdin, Deno.stdout, {
    echo(text: unknown): Promise<unknown> {
      return Promise.resolve(`${text}`);
    },
    async register(name: unknown, cmd: unknown): Promise<void> {
      if (typeof name !== "string") {
        throw new Error("'name' must be string");
      }
      if (!Array.isArray(cmd)) {
        throw new Error("'cmd' must be a string array");
      }
      await facade.debug(`Register '${name}' (${cmd.join(" ")})`);
      pluginRegistry[name] = runPlugin(cmd, facade);
    },
    async dispatch(
      name: unknown,
      method: unknown,
      params: unknown,
    ): Promise<unknown> {
      if (typeof name !== "string") {
        throw new Error("'name' must be string");
      }
      if (typeof method !== "string") {
        throw new Error("'method' must be string");
      }
      if (!Array.isArray(params)) {
        throw new Error("'params' must be a string array");
      }
      await facade.debug(`Dispatch '${method}' in '${name}'`);
      const session = pluginRegistry[name];
      if (!session) {
        throw new Error(`No plugin '${name}' is registered`);
      }
      return await session.call(method, ...params);
    },
  });
  await facade.waitClosed();
}
