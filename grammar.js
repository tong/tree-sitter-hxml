
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
  name: "hxml_connect",
  extras: $ => [/\s+/, $.comment],
  // extras: $ => [/\s+/],  // only whitespace

  rules: {
    source_file: $ => repeat(choice(
      $.include,
      $.flag_classpath,
      $.flag_connect,
      $.flag_dce,
      $.flag_define,
      $.flag_library,
      $.flag_main,
      $.flag_target,
      $.flag,
    )),


    flag: $ => token(choice(...simpleFlags)),

    flag_define: $ => seq("-D", choice(
      $.define_key,
      seq($.define_key, "=", $.define_value),
    )),
    define_key: $ => /[^#\s=]+/,
    define_value: $ => /[^#\s]+/,

    flag_classpath: $ => seq(choice("-p", "--class-path"), $.path),

    flag_main: $ => seq(choice("--main", "-m"), $.classpath),

    flag_connect: $ => seq("--connect", $.connect_arg),
    connect_arg: $ => choice(
      seq($.connect_host, ":", $.connect_port),
      $.connect_port
    ),
    connect_host: $ => token(/[A-Za-z_.-][A-Za-z0-9_.-]*/),
    connect_port: $ => token(/\d+/),

    flag_dce: $ => seq("--dce", choice("std", "full", "no")),

    flag_library: $ => seq(choice("-L", "--library"), $._library_value),
    _library_value: $ => seq(
      $.library_name,
      optional(seq(":", $.library_version))
    ),
    library_name: $ => /[A-Za-z0-9_.-]+/,
    library_version: $ => /[A-Za-z0-9_.-]+/,

    //TODO:
    flag_target: $ => seq(
      $.target_name,
      $.target_path
    ),
    target_name: $ => choice("-hl", "--hl", "-js", "--js"),
    target_path: $ => /[a-zA-Z0-9._\/-]+\.(hl|js)/,


    //----------------------------------

    comment: $ => token(seq("#", /.*/)),
    include: $ => /[^#\s]+\.hxml/,
    classpath: $ => /[A-Za-z_][A-Za-z0-9_.-]*/,
    path: $ => /[^#\s]+/,
  }
});
