; Inject Haxe inside --macro expressions
(
  (macro
    (expr) @injection.content)
  ; Skip if the expression starts with a single or double quote
  (#not-match? @injection.content "^['\\\"]")
  (#set! injection.language "haxe")
)
