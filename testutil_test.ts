import { assertEquals, VimSession } from "./deps_test.ts";
import { withNvim, withVim } from "./testutil.ts";
import { Session } from "./deps.ts";

Deno.test("withNvim start nvim to communicate with", async () => {
  await withNvim(async (reader, writer) => {
    const session = new Session(reader, writer);
    session.listen();
    const result = await session.call("nvim_eval", "1 + 1");
    assertEquals(result, 2);
    await session.notify("nvim_command", "qall!");
  });
});

Deno.test("withVim start vim to communicate with", async () => {
  await withVim(async (reader, writer) => {
    const session = new VimSession(reader, writer);
    session.listen();
    const result = await session.expr("1 + 1");
    assertEquals(result, 2);
    await session.ex("qall!");
  });
});
