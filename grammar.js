/**
 * @file Haxe hxml files
 * @author tong <tong@disktree.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hxml",
  extras: _ => [/\s+/],
  rules: {

    source_file: $ => repeat(choice(
      $.class_path,
      $.cmd,
      $.cwd,
      $.comment,
      $.connect,
      $.dce,
      $.define,
      $.display,
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
    )),

    // Standalone flags without arguments
    flag: _ => token(choice(
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
    )),

    // Define directives: -D key or -D key=value
    define: $ => seq(
      choice("-D", "--define"),
      alias(/[^#\s=]+(=[^#\s]*)?/, $.constant)
    ),

    undefine: $ => seq("--undefine", $.argument),
    display: $ => seq("--display", $.argument),

    // Target compilation options
    target: $ => choice(
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
      seq("--custom-target", alias(/[A-Za-z0-9_-]+(=[^#\s]+)?/, $.custom_target)),
      seq("--run", $.dot_path, repeat($.argument)),
      "--interp"
    ),

    // Main class specification
    main: $ => seq(choice("-m", "--main"), $.dot_path),

    // Class path specification
    class_path: $ => seq(choice("-p", "--class-path"), $.directory),

    // Haxe bytecode library
    hxb_lib: $ => seq("--hxb-lib", $.file),

    // Library specification with optional version
    library: $ => seq(
      choice("-L", "--library"),
      alias(/[A-Za-z0-9_.-]+(:[A-Za-z0-9_.-]+)?/, $.library_spec)
    ),

    // Macro execution
    macro: $ => seq("--macro", $.expr),
    // Macro expressions - can be unquoted or single-quoted
    expr: _ => choice(
      // Unquoted: identifiers, dots, parentheses, semicolons
      token(/[A-Za-z_][A-Za-z0-9_.]*(?:\([^)]*\))?;?/),
      // Single-quoted: anything until closing quote
      token(/'[^']*'/)
    ),

    json_output: $ => seq('--json', $.file),
    xml_output: $ => seq('--xml', $.file),

    cmd: $ => seq("--cmd", $.command),
    cwd: $ => seq(choice("-C", "--cwd"), $.directory),
    dce: $ => seq("--dce", alias(choice("std", "full", "no"), $.dce_mode)),
    remap: $ => seq("--remap", seq($.dot_path, ":", $.dot_path)),
    resource: $ => seq(
      choice("-r", "--resource"),
      $.file,
      optional(seq("@", $.resource_name))
    ),

    connect: $ => seq("--connect", $.net_address),
    server_listen: $ => seq("--server-listen", $.server_address),
    server_connect: $ => seq("--server-connect", $.server_address),

    // dot_path: _ => token(/[A-Za-z_][A-Za-z0-9_.-]*/),
    dot_path: _ => token(/[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)*/),
    argument: _ => token(/[^#\s]+/),
    file: _ => token(/[^#\s@]+/),
    directory: _ => token(/[^#\s]+/),
    command: _ => token(/[^#\s][^#\n]*/),

    // Network address: [IPv6], IPv4, hostname, or just port
    net_address: _ => token(
      /(?:\[[0-9A-Fa-f:]+\]|[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)?:[0-9]{1,5}|[0-9]{1,5}/
    ),

    server_address: _ => token(choice("stdio", /[^#\s]+/)),
    resource_name: _ => token(/[A-Za-z_][A-Za-z0-9_]*/),

    package: _ => token(/[a-z][A-Za-z0-9_]*/),
    type: _ => token(/[A-Z][A-Za-z0-9_]*/),
    type_path: $ => seq(
      optional(seq($.package, repeat(seq(".", $.package)), ".")),
      $.type
    ),

    comment: _ => token(seq("#", /.*/)),
    include: _ => token(/[^#\s]+\.hxml/),
  }
});
