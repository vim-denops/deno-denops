import { Dispatcher } from "https://deno.land/x/msgpack_rpc@v2.3/mod.ts";
import {
  Message,
  Session,
} from "https://deno.land/x/vim_channel_command@v0.0/mod.ts";
import { AbstractFacade } from "../facade.ts";

class Vim extends AbstractFacade {
  #session: Session;
  #listener: Promise<void>;

  constructor(session: Session) {
    super();
    this.#session = session;
    this.#listener = this.#session.listen();
  }

  command(expr: string): Promise<void> {
    return this.#session.ex(expr).catch(this.error).then();
  }

  eval(expr: string): Promise<unknown> {
    return this.#session.expr(expr).catch(this.error);
  }

  call(fn: string, ...args: unknown[]): Promise<unknown> {
    return this.#session.call(fn, ...args).catch(this.error);
  }

  waitClosed(): Promise<void> {
    return this.#listener;
  }
}

export function createVim(
  reader: Deno.Reader & Deno.Closer,
  writer: Deno.Writer,
  dispatcher: Dispatcher,
): Vim {
  const session = new Session(
    reader,
    writer,
    async function (message: Message) {
      const [msgid, expr] = message;
      if (isValidMessage(expr)) {
        const name = expr[0];
        const params = expr.slice(1);
        // deno-lint-ignore no-explicit-any
        const result = await (dispatcher as any)[name](...params);
        await this.reply(msgid, result);
      } else {
        throw new Error(
          `Unexpected JSON channel message is received: ${
            JSON.stringify(expr)
          }`,
        );
      }
    },
  );
  return new Vim(session);
}

type EchoMessage = ["echo", string];
type DispatchMessage = ["dispatch", string, string, unknown[]];
type RegisterMessage = ["register", string, string[]];
type ValidMessage = EchoMessage | DispatchMessage | RegisterMessage;

function isEchoMessage(data: unknown): data is EchoMessage {
  return (
    Array.isArray(data) &&
    data.length === 2 &&
    data[0] === "echo" &&
    typeof data[1] === "string"
  );
}

function isDispatchMessage(data: unknown): data is DispatchMessage {
  return (
    Array.isArray(data) &&
    data.length === 4 &&
    data[0] === "dispatch" &&
    typeof data[1] === "string" &&
    typeof data[2] === "string" &&
    Array.isArray(data[3])
  );
}

function isRegisterMessage(data: unknown): data is RegisterMessage {
  return (
    Array.isArray(data) &&
    data.length === 3 &&
    data[0] === "register" &&
    typeof data[1] === "string" &&
    Array.isArray(data[2])
  );
}

function isValidMessage(data: unknown): data is ValidMessage {
  return (
    isEchoMessage(data) || isDispatchMessage(data) || isRegisterMessage(data)
  );
}
