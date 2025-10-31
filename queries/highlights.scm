(comment) @comment
[":" "="] @punctuation

[
  (directory)
  (file)
  (include)
] @string

(command) @function

(section) @section_block
(section "--next") @keyword

(package) @namespace
(type_path) @type
(type_name) @type
(class_path) @type

[
  (class_path)
  (cmd)
  (connect)
  (cwd)
  (dce)
  (define)
  (flag)
  (hxb)
  (hxb_lib)
  (json_output)
  (library)
  (macro)
  (main)
  (remap)
  (resource)
  (run)
  (server_connect)
  (server_listen)
  (target)
  (undefine)
  (xml_output)
] @keyword

(library (name) @constant)
(library (version) @number)

[
  (custom_target)
  (dce_mode)
] @constant

(define_value) @string

[
  (argument)
  (define_key)
] @property

[
  (define_value)
  (net_address)
  (server_address)
] @string

(macro (expr) @function)
; (net_address) @number
(remap ":" @punctuation)
(remap (package)  @type)
(resource_name) @property
(resource "@" @punctuation)

