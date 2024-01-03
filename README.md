# denops

> [!IMPORTANT]
>
> **This module has been deprecated since v0.12.** Although it carries the
> v6.0.0 tag for historical reasons, it is recommended to use [denops_core]
> instead.
>
> Please note that if you are a plugin developer using [denops.vim], you should
> consider using [denops_std] instead.

[![test](https://github.com/vim-denops/deno-denops/workflows/test/badge.svg)](https://github.com/vim-denops/deno-denops/actions?query=workflow%3Atest)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/denops/mod.ts)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x/denops-lightgrey.svg?logo=deno)](https://deno.land/x/denops)

This is a core module of [denops.vim] which is an ecosystem of Vim/Neovim to
write plugins in [Deno].

Note that most of users should use [denops_std] module instead to write plugins
of [denops.vim]. This module is designed as a core layer of [denops_std] so
using this module directly from plugins is strongly dis-recommended.

[deno]: https://deno.land/
[denops.vim]: https://github.com/vim-denops/denops.vim
[denops_core]: https://deno.land/x/denops_core
[denops_std]: https://deno.land/x/denops_std
