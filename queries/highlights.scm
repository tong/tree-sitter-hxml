; Comments
(comment) @comment

; Keywords / Flags
(flag) @keyword

; Flags with arguments
[
  (class_path)
  (cmd)
  (connect)
  (cwd)
  (dce)
  (define)
  (hxb)
  (hxb_lib)
  (library)
  (macro)
  (main)
  (remap)
  (resource)
  (server_connect)
  (server_listen)
  (target)
  (json_output)
  (xml_output)
] @keyword

; Constants & Modes
[
  ; (constant)
  ; (library_spec)
  (dce_mode)
  (custom_target)
] @constant

; Strings / Paths
[
  (file)
  (directory)
  (include)
  (command)
  (argument)
  (net_address)
  (server_address)
] @string

; Names & Types
(package) @namespace
(type_path) @type
(resource_name) @property

; Macro expressions
(macro (expr) @function)

; defines
(define_key) @constant
(define_value) @string
