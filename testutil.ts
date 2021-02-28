const DEFAULT_TIMEOUT = 100;

const DENOPS_VIM = Deno.env.get("DENOPS_VIM") ?? "vim";
const DENOPS_NVIM = Deno.env.get("DENOPS_NVIM") ?? "nvim";

export type WithOptions = {
  timeout?: number;
  commands?: string[];
};

export async function withNvim(
  main: (
    reader: Deno.Reader & Deno.Closer,
    writer: Deno.Writer,
  ) => Promise<void>,
  options: WithOptions = {},
) {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const cmds = (options.commands ?? []).map((c) => ["--cmd", c]).flat();
  const nvim = Deno.run({
    "cmd": [
      DENOPS_NVIM,
      "--clean",
      "--embed",
      "--headless",
      "--cmd",
      `call timer_start(${timeout}, { -> execute('qall!') })`,
      ...cmds,
    ],
    "stdin": "piped",
    "stdout": "piped",
  });
  try {
    await main(nvim.stdout, nvim.stdin);
    await nvim.status();
  } finally {
    nvim.stdin.close();
    nvim.stdout.close();
    nvim.close();
  }
}

export async function withVim(
  main: (
    reader: Deno.Reader & Deno.Closer,
    writer: Deno.Writer,
  ) => Promise<void>,
  options: WithOptions = {},
) {
  const server = Deno.listen({
    transport: "tcp",
    hostname: "127.0.0.1",
    port: 0,
  });
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  const addr = server.addr as Deno.NetAddr;
  const cmds = (options.commands ?? []).map((c) => ["--cmd", c]).flat();
  const vim = Deno.run({
    "cmd": [
      DENOPS_VIM,
      "--clean",
      "--not-a-term",
      "-NnEs",
      "--cmd",
      `call timer_start(${timeout}, { -> execute('qall!') })`,
      "--cmd",
      `let ch = ch_open('127.0.0.1:${addr.port}')`,
      ...cmds,
    ],
    "stdin": "piped",
  });
  const conn = await server.accept();
  try {
    await main(conn, conn);
    await vim.status();
  } finally {
    conn.close();
    server.close();
    vim.stdin.close();
    vim.close();
  }
}
