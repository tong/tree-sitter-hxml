;; HXML semantic highlighting

(comment) @comment

;;;
;;; Keywords & Flags
;;;

;; Simple flags without arguments
(flag) @keyword

;; Flags with arguments
(class_path) @keyword
(cmd) @keyword
(connect) @keyword
(cwd) @keyword
(dce) @keyword
(define) @keyword
(hxb) @keyword
(hxb_lib) @keyword
(library) @keyword
(macro) @keyword
(main) @keyword
(remap) @keyword
(resource) @keyword
(server_connect) @keyword
(server_listen) @keyword
(target) @keyword
(json_output) @keyword
(xml_output) @keyword

;;;
;;; Values & Arguments
;;;

;; Literals
(constant) @constant
(library_spec) @constant
(dce_mode) @constant
(custom_target) @constant
(net_address) @string
(server_address) @string

;;
;; Paths and Types
;;
(file) @string
(directory) @string
(include) @string ; hxml file inclusion
(package) @namespace
(type_path) @type
(package) @namespace
(resource_name) @property

;; Other arguments

(command) @string
(argument) @string

;; Macro calls

(macro
  (expr) @function)

;;;
;;; Rule specializations
;;;

;; Highlight the constant within a define statement
(define
  (constant) @constant)
