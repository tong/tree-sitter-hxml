/**
 * @file Haxe hxml files
 * @author tong <tong@disktree.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const simpleFlags = [
  "--undefine",
  "--haxelib-global",
  "--no-traces",
  "--no-output",
  "--no-inline",
  "--no-opt",
  "-v",
  "--verbose",
  "--debug",
  "--prompt",
  "--times",
  "--each",
  "--next",
  "--display",
  "--version",
  "-h",
  "--help",
  "--help-defines",
  "--help-user-defines",
  "--help-metas",
  "--help-user-metas",
];

module.exports = grammar({
  name: "hxml",
  extras: $ => [/\s+/],
  rules: {

    source_file: $ => repeat(choice(
      $.class_path,
      $.cmd,
      $.cwd,
      $.comment,
      $.connect,
      $.dce,
      $.define,
      $.hxb_lib,
      $.include,
      $.library,
      $.macro,
      $.main,
      $.remap,
      $.resource,
      // $.section,
      $.server_connect,
      $.server_listen,
      $.target,
      $.type_path,
      $.flag,
      $.debug,
    )),

    //TODO:
    // section: $ => seq(
    //   alias("--next", $.flag),
    //   repeat(choice(
    //     $.flag,
    //     $.define,
    //     $.target,
    //     $.macro,
    //     $.connect,
    //     $.server_connect,
    //     $.server_listen,
    //     $.cmd
    //   ))
    // ),
    // conflicts: $ => [$.section],

    flag: $ => token(choice(...simpleFlags)),
    debug: $ => token("--debug"),

    define: $ => seq(
      choice("-D", "--define"),
      alias(/[^#\s]+/, $.constant)
    ),

    target: $ => choice(
      seq(alias("--js", $.flag), $.file),
      seq(alias("--lua", $.flag), $.file),
      seq(alias("--swf", $.flag), $.file),
      seq(alias("--neko", $.flag), $.file),
      seq(alias("--php", $.flag), $.directory),
      seq(alias("--cpp", $.flag), $.directory),
      seq(alias("--cppia", $.flag), $.file),
      seq(alias("--jvm", $.flag), $.file),
      seq(alias("--python", $.flag), $.file),
      seq(alias("--hl", $.flag), $.file),
      seq(alias("--custom-target", $.flag), alias(/ [A - Za - z0 -9_ -] + (= [^#\s] +) ?/, $.custom_target)),
      seq(alias("--run", $.flag), $.type_path, repeat($.path)),
      alias("--interp", $.flag),
    ),

    // main: $ => seq(alias(choice("-m", "--main"), $.flag), $.dot_path),
    main: $ => seq(choice("-m", "--main"), $.dot_path),
    class_path: $ => seq(alias(choice("-p", "--class-path"), $.flag), $.directory),
    hxb_lib: $ => seq(alias("--hxb-lib", $.flag), $.file),

    library: $ => seq(
      alias(choice("-L", "--library"), $.flag),
      token(/[A-Za-z0-9_.-]+/)
    ),
    // version: $ => /[A-Za-z0-9_.-]+/, // TODO:

    macro: $ => seq(alias("--macro", $.flag), $.expr),
    expr: $ => choice(
      // unquoted: allow identifiers, dots, parentheses, semicolons
      token(/[A-Za-z_][A-Za-z0-9_.]*(?:\([^)]*\))?;?/),
      // single-quoted: anything until closing '
      token(/'[^']*'/)
    ),

    cmd: $ => seq(alias("--cmd", $.flag), $.shellcommand),
    cwd: $ => seq(alias(choice("-C", "--cwd"), $.flag), $.directory),
    dce: $ => seq(alias("--dce", $.flag), alias(choice("std", "full", "no"), $.constant)),
    remap: $ => seq(alias("--remap", $.flag), seq($.package_ident, ":", $.package_ident)),
    resource: $ => seq(alias(choice("-r", "--resource"), $.flag), $.file),//TODO: @name

    connect: $ => seq(alias("--connect", $.flag), /[^#\s]+/),
    server_listen: $ => seq(alias("--server-listen", $.flag), alias(/[^#\s]+/, $.string)),
    server_connect: $ => seq(alias("--server-connect", $.flag), alias(/[^#\s]+/, $.string)),

    dot_path: $ => token(/[A-Za-z_][A-Za-z0-9_.-]*/),
    path: $ => token(/[^#\s]+/),
    file: $ => token(/[^#\s]+/),
    directory: $ => token(/[^#\s]+/),
    shellcommand: $ => token(/[^#\s][^#\n]*/),

    // either [IPv6] or IPv4 or hostname (optional) followed by :port, OR plain port
    net_address: $ => token(
      /(?:\[[0-9A-Fa-f:]+\]|[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)?:[0-9]{1,5}|[0-9]{1,5}/
    ),

    package_ident: $ => token(/[a-z][A-Za-z0-9_]*/),
    type_ident: $ => token(/[A-Z][A-Za-z0-9_]*/),
    type_path: $ => seq(
      optional(seq($.package_ident, repeat(seq(".", $.package_ident)), ".")),
      $.type_ident
    ),

    comment: _ => token(seq("#", /.*/)),
    include: _ => token(/[^#\s]+\.hxml/),
  }
});
