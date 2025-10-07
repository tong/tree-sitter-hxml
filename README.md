# tree-sitter-hxml

A [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [haxe](https://haxe.org/) [hxml](https://haxe.org/manual/compiler-usage-hxml.html) files.

## Grammar Support

- All compilation targets (`--js`, `--cpp`, `--hl`, ...)
- Library dependencies with versions (`--library lib:1.2.3`)
- Defines with values (`-D key=value`)
- Resource embedding (`--resource file@name`)
- Macro execution (`--macro expr`)
- Server configurations (`--connect`, `--server-listen`)
- Custom targets

## Installation

### Neovim

You need to be on the [main](https://github.com/nvim-treesitter/nvim-treesitter/tree/main) branch of nvim-treesitter (not master)

```lua
{
  "nvim-treesitter/nvim-treesitter",
  branch = "main",
  build = ":TSUpdate",
  config = function()
    local parsers = require("nvim-treesitter.parsers")
    parsers.hxml = {
      install_info = {
        url = "https://github.com/tong/tree-sitter-hxml",
        queries = "queries",
        generate = true,
      },
    }
  end,
}
```

## Examples

See the [`examples/`](examples/) directory for comprehensive hxml configurations covering various use cases.

## Development

```bash
# Generate parser
npm install
npx tree-sitter generate

# Run tests
npx tree-sitter test

# Test examples
./scripts/test-examples.sh
```

[![test](https://github.com/tong/tree-sitter-hxml/actions/workflows/test-parser.yml/badge.svg)](https://github.com/tong/tree-sitter-hxml/actions/workflows/test-parser.yml)
