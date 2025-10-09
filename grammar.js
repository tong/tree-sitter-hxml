/**
 * @file Haxe hxml files
 * @author tong <tong@disktree.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "hxml",
  extras: (_) => [/\s+/],
  conflicts: ($) => [[$.package]],
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

    flag: (_) =>
      token.immediate(
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
        seq("--run", $.type_path, repeat($.argument)),
        "--interp",
      ),

    define: ($) =>
      seq(choice("-D", "--define"), alias(/[^#\s=]+(=[^#\s]*)?/, $.constant)),
    undefine: ($) => seq("--undefine", $.argument),

    display: ($) => seq("--display", $.argument),
    class_path: ($) => seq(choice("-p", "--class-path"), $.directory),
    main: ($) => seq(choice("-m", "--main"), $.type_path),

    hxb: ($) => seq("--hxb", $.file),
    hxb_lib: ($) => seq("--hxb-lib", $.file),

    library: ($) =>
      seq(
        choice("-L", "--library"),
        alias(/[A-Za-z0-9_.-]+(:[A-Za-z0-9_.-]+)?/, $.library_spec),
      ),

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
        field("package", $.package),
        ":",
        field("target", $.package),
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

    argument: ($) => choice($._quoted_arg, $._arg_token),
    _quoted_arg: (_) => token(seq('"', /[^"]*/, '"')),
    _arg_token: (_) => token(/[^\s#"]+/),

    type_path: ($) =>
      seq(optional(seq($.package, ".")), $.type, repeat(seq(".", $.type))),
    package: ($) => seq($.pack, repeat(seq(".", $.pack))),
    pack: (_) => token(/[a-z][A-Za-z0-9_]*/),
    type: (_) => token(/[A-Z][A-Za-z0-9_]*/),

    file: ($) => choice($._quoted_arg, token(/[^\s@#"]+/)),
    directory: ($) => choice($._quoted_arg, $._arg_token),
    command: (_) => token(/[^#\n]+/),

    // Network address: [IPv6], IPv4, hostname, or just port
    net_address: (_) =>
      token(
        /(?:\[[0-9A-Fa-f:]+\]|[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)?:[0-9]{1,5}|[0-9]{1,5}/,
      ),

    include: (_) => token(/[^#\s]+\.hxml/),
    comment: (_) => token(seq("#", /.*/)),
  },
});
