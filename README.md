# denops_core

[![test](https://github.com/vim-denops/deno-denops/workflows/test/badge.svg)](https://github.com/vim-denops/deno-denops/actions?query=workflow%3Atest)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/denops/mod.ts)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x/denops-lightgrey.svg?logo=deno)](https://deno.land/x/denops)

This is a core module of [denops.vim][denops.vim] which is an ecosystem of
Vim/Neovim to write plugins in [Deno][deno].

Note that most of users should use [denops_std][denops_std] module instead to
write plugins of [denops.vim][denops.vim]. This module is designed as a core
layer of [denops_std][denops_std] so using this module directly from plugins is
strongly dis-recommended.

[deno]: https://deno.land/
[denops.vim]: https://github.com/vim-denops/denops.vim
[denops_std]: https://deno.land/x/denops_std
