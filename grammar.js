/**
 * @file Haxe hxml files
 * @author tong <tong@disktree.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hxml",
  extras: ($) => [/\s+/],
  rules: {
    source_file: ($) => repeat($._line),

    _line: ($) =>
      seq(
        optional(
          choice(
            $.class_path,
            $.cmd,
            $.cwd,
            $.connect,
            $.dce,
            $.define,
            $.display,
            $.hxb,
            $.hxb_lib,
            $.include,
            $.library,
            $.macro,
            $.main,
            $.remap,
            $.resource,
            $.server_connect,
            $.server_listen,
            $.target,
            $.type_path,
            $.undefine,
            $.json_output,
            $.xml_output,
            $.flag,
          ),
        ),
        optional($.comment),
        /\r?\n/,
      ),

    // Standalone flags without arguments
    flag: (_) =>
      token(
        choice(
          "--debug",
          "--haxelib-global",
          "--no-traces",
          "--no-output",
          "--no-inline",
          "--no-opt",
          "-v",
          "--verbose",
          "--prompt",
          "--times",
          "--each",
          "--next",
          "--version",
          "-h",
          "--help",
          "--help-defines",
          "--help-user-defines",
          "--help-metas",
          "--help-user-metas",
        ),
      ),

    // Target compilation options
    target: ($) =>
      choice(
        seq("--js", $.file),
        seq("--lua", $.file),
        seq("--swf", $.file),
        seq("--neko", $.file),
        seq("--php", $.directory),
        seq("--cpp", $.directory),
        seq("--cppia", $.file),
        seq("--jvm", $.file),
        seq("--python", $.file),
        seq("--hl", $.file),
        seq(
          "--custom-target",
          alias(/[A-Za-z0-9_-]+(=[^#\s]+)?/, $.custom_target),
        ),
        seq("--run", $.dot_path, repeat($.argument)),
        "--interp",
      ),

    // Define directives: -D key or -D key=value
    define: ($) =>
      seq(choice("-D", "--define"), alias(/[^#\s=]+(=[^#\s]*)?/, $.constant)),

    undefine: ($) => seq("--undefine", $.argument),

    display: ($) => seq("--display", $.argument),

    // Main class specification
    main: ($) => seq(choice("-m", "--main"), $.dot_path),

    // Class path specification
    class_path: ($) => seq(choice("-p", "--class-path"), $.directory),

    // Haxe bytecode library
    hxb: ($) => seq("--hxb", $.file),
    hxb_lib: ($) => seq("--hxb-lib", $.file),

    // Library specification with optional version
    library: ($) =>
      seq(
        choice("-L", "--library"),
        alias(/[A-Za-z0-9_.-]+(:[A-Za-z0-9_.-]+)?/, $.library_spec),
      ),

    // Macro - expressions can be unquoted or single-quoted
    macro: ($) => seq("--macro", $.expr),
    expr: (_) =>
      choice(
        // unquoted expression
        /[A-Za-z_][A-Za-z0-9_.]*(?:\([^)]*\))?;?/,
        // quoted expression
        seq("'", /[^']*/, "'"),
      ),

    json_output: ($) => seq("--json", $.file),
    xml_output: ($) => seq("--xml", $.file),

    cmd: ($) => seq("--cmd", $.command),
    cwd: ($) => seq(choice("-C", "--cwd"), $.directory),
    dce: ($) => seq("--dce", alias(choice("std", "full", "no"), $.dce_mode)),
    remap: ($) =>
      seq(
        "--remap",
        seq(field("package", $.dot_path), ":", field("target", $.dot_path)),
      ),
    resource: ($) =>
      seq(
        choice("-r", "--resource"),
        field("file", alias(choice($._quoted_arg, token(/[^\s@#"]+/)), $.file)),
        optional(
          seq(
            token.immediate("@"),
            field(
              "name",
              alias(token(/[A-Za-z_][A-Za-z0-9_]*/), $.resource_name),
            ),
          ),
        ),
      ),
    resource_name: (_) => token(/[A-Za-z_][A-Za-z0-9_]*/),

    connect: ($) => seq("--connect", $.net_address),
    server_listen: ($) => seq("--server-listen", $.server_address),
    server_connect: ($) => seq("--server-connect", $.server_address),
    server_address: (_) => token(choice("stdio", /[^#\s]+/)),

    _quoted_arg: (_) => token(seq('"', /[^"]*/, '"')),
    _arg_token: (_) => token(/[^\s#"]+/),

    argument: ($) => choice($._quoted_arg, $._arg_token),
    file: ($) => choice($._quoted_arg, token(/[^\s@#"]+/)),
    directory: ($) => choice($._quoted_arg, $._arg_token),

    dot_path: (_) => token(/[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*/),
    command: (_) => token(/[^#\n]+/),

    // Network address: [IPv6], IPv4, hostname, or just port
    net_address: (_) =>
      token(
        /(?:\[[0-9A-Fa-f:]+\]|[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)?:[0-9]{1,5}|[0-9]{1,5}/,
      ),

    package: (_) => token(/[a-z][A-Za-z0-9_]*/),
    type: (_) => token(/[A-Z][A-Za-z0-9_]*/),
    type_path: ($) =>
      seq(optional(seq($.package, repeat(seq(".", $.package)), ".")), $.type),

    //TODO: ? newline: (_) => token.immediate(/\\?\r?\n/),
    include: (_) => token(/[^#\s]+\.hxml/),
    comment: (_) => token(seq("#", /.*/)),
  },
});
