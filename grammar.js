/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/**
 * @param {string} short - Short flag (-v)
 * @param {string} long - Long flag (--verbose)
 * @param {Rule} arg
 * @return {Rule}
 */
const flagWithArg = (short, long, arg) => seq(choice(short, long), arg);

export default grammar({
  name: "hxml",
  extras: ($) => [/\s+/, $.comment],
  conflicts: ($) => [[$.package]],
  rules: {
    hxml: ($) => repeat($.section),
    section: ($) => prec.right(seq(optional($._next), repeat1($._line))),
    _next: (_) => token("--next"),
    _line: ($) =>
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
        $.run,
        $.server_connect,
        $.server_listen,
        $.target,
        $.type_path,
        $.undefine,
        $.json_output,
        $.xml_output,
        $.flag,
      ),

    flag: (_) =>
      token(
        choice(
          "--debug",
          "--haxelib-global",
          "--no-traces",
          "--no-output",
          "--no-inline",
          "--no-opt",
          "--verbose",
          "--prompt",
          "--times",
          "--each",
          "--version",
          "--help",
          "--help-defines",
          "--help-user-defines",
          "--help-metas",
          "--help-user-metas",
          "-h",
          "-v",
        ),
      ),

    target: ($) =>
      choice(
        seq(choice("-js", "--js"), $.file),
        seq(choice("-lua", "--lua"), $.file),
        seq(choice("-swf", "--swf"), $.file),
        seq(choice("-neko", "--neko"), $.file),
        seq(choice("-php", "--php"), $.directory),
        seq(choice("-cpp", "--cpp"), $.directory),
        seq(choice("-cppia", "--cppia"), $.file),
        seq(choice("-jvm", "--jvm"), $.file),
        seq(choice("-python", "--python"), $.file),
        seq(choice("-hl", "--hl"), $.file),
        seq(
          "--custom-target",
          alias(/[A-Za-z0-9_-]+(=[^#\s]+)?/, $.custom_target),
        ),
        "--interp",
      ),

    interp: ($) => seq("--interp", $.type_path),
    run: ($) => seq("--run", $.type_path, repeat($.argument)),
    main: ($) => flagWithArg("-m", "--main", $.type_path),
    class_path: ($) => flagWithArg("-p", "--class-path", $.directory),
    display: ($) => seq("--display", $.argument),
    define: ($) =>
      seq(
        choice("-D", "--define"),
        seq(
          alias(/[^#\s=]+/, $.define_key),
          optional(seq("=", alias(/[^#\s]*/, $.define_value))),
        ),
      ),
    undefine: ($) => seq("--undefine", $.argument),

    hxb: ($) => seq("--hxb", $.file),
    hxb_lib: ($) => seq("--hxb-lib", $.file),

    library: ($) =>
      seq(
        choice("-L", "--library"),
        seq(
          alias(/[A-Za-z0-9_.-]+/, $.name),
          optional(
            seq(
              token.immediate(":"),
              choice($.version, alias(/[a-zA-Z0-9_.\-\:]+/, $.version)),
            ),
          ),
        ),
      ),

    macro: ($) => seq("--macro", $.expr),
    expr: (_) =>
      choice(
        token(seq("'", /[^']*/, "'")), // Quoted expression
        /[A-Za-z_][A-Za-z0-9_.]*(\(.*\))?;?/, // Unquoted expression
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
        field("file", $.file),
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

    file: ($) => choice($._quoted_arg, token(/[^\s@#"]+/)),
    command: (_) => token(/[^#\n]+/),
    directory: ($) => choice($._quoted_arg, $._arg_token),
    version: (_) => token(/[0-9]+\.[0-9]+\.[0-9]+/),

    argument: ($) => choice($._quoted_arg, $._arg_token),
    _quoted_arg: (_) => token(seq('"', /[^"]*/, '"')),
    _arg_token: (_) => token(/[^\s#"]+/),

    identifier: (_) => /[a-z_][a-zA-Z0-9_]*/,
    package: ($) => seq($.identifier, repeat(seq(".", $.identifier))),
    type_name: (_) => /[A-Z][a-zA-Z0-9_]*/,
    type_path: ($) =>
      choice(
        seq($.package, ".", field("type", $.type_name)),
        field("type", $.type_name),
      ),

    // Network address: [IPv6], IPv4, hostname, or just port
    net_address: (_) =>
      token(
        /(?:\[[0-9A-Fa-f:]+\]|[0-9]{1,3}(?:\.[0-9]{1,3}){3}|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*)?:[0-9]{1,5}|[0-9]{1,5}/,
      ),

    include: ($) => alias(/[^#\s]+\.hxml/, $.file),
    comment: (_) => token(seq("#", /.*/)),
  },
});
