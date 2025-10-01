package tree_sitter_hxml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_hxml "github.com/tong/tree-sitter-hxml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_hxml.Language())
	if language == nil {
		t.Errorf("Error loading Hxml grammar")
	}
}
