# tree-sitter-hxml

A [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [Haxe](https://haxe.org/) [HXML](https://haxe.org/manual/compiler-usage-hxml.html) files.

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

```lua
{
  "nvim-treesitter/nvim-treesitter",
  config = function()
    local parser_config = require "nvim-treesitter.parsers".get_parser_configs()
    parser_config.hxml = {
      install_info = {
        url = "https://github.com/tong/tree-sitter-hxml",
        files = {"src/parser.c"},
        branch = "main",
      },
      filetype = "hxml",
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
