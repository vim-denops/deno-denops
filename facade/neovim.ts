import {
  Dispatcher,
  Session,
} from "https://deno.land/x/msgpack_rpc@v2.3/mod.ts";
import { AbstractFacade } from "../facade.ts";

class Neovim extends AbstractFacade {
  #session: Session;
  #listener: Promise<void>;

  constructor(session: Session) {
    super();
    this.#session = session;
    this.#listener = this.#session.listen();
  }

  command(expr: string): Promise<void> {
    // XXX: Should not be 'notify' here?
    return this.#session.call("nvim_command", expr).catch(this.error).then();
  }

  eval(expr: string): Promise<unknown> {
    return this.#session.call("nvim_eval", expr).catch(this.error);
  }

  call(fn: string, ...args: unknown[]): Promise<unknown> {
    return this.#session.call("nvim_call_function", fn, args).catch(this.error);
  }

  waitClosed(): Promise<void> {
    return this.#listener;
  }
}

export function createNeovim(
  reader: Deno.Reader & Deno.Closer,
  writer: Deno.Writer,
  dispatcher: Dispatcher,
): Neovim {
  const session = new Session(reader, writer, dispatcher);
  return new Neovim(session);
}
