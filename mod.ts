/**
 * This is a core module of [denops.vim] which is an ecosystem of Vim/Neovim to write plugins in [Deno].
 *
 * Note that most of users should use [denops_std] module instead to write plugins of [denops.vim].
 * This module is designed as a core layer of [denops_std] so using this module directly from plugins is **strongly dis-recommended**.
 *
 * [deno]: https://deno.land/
 * [denops.vim]: https://github.com/vim-denops/denops.vim
 * [denops_core]: https://deno.land/x/denops_core
 * [denops_std]: https://deno.land/x/denops_std
 *
 * @deprecated This module is deprecated. Use [denops_core] module instead.
 * @module
 */

export { BatchError } from "./denops.ts";
export type { Context, Denops, Dispatcher, Meta } from "./denops.ts";
