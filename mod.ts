/**
 * This is a core module of [denops.vim][denops.vim] which is an ecosystem of
 * Vim/Neovim to write plugins in [Deno][deno].
 *
 * Note that most of users should use [denops_std][denops_std] module instead to
 * write plugins of [denops.vim][denops.vim]. This [denops][denops] module is designed
 * as a core layer of [denops_std][denops_std] so using this module directly from
 * plugins is **strongly dis-recommended**.
 *
 * [deno]: https://deno.land/
 * [denops.vim]: https://github.com/vim-denops/denops.vim
 * [denops]: https://github.com/vim-denops/deno-denops
 * [denops_std]: https://github.com/vim-denops/deno-denops-std
 *
 * @module
 */

export { BatchError } from "./denops.ts";
export type { Context, Denops, Dispatcher, Meta } from "./denops.ts";
