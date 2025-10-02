#!/bin/bash

# Test script for HXML example files
# Used in CI/CD workflows to validate parser functionality

set -e

echo "🔍 Testing HXML Parser with Example Files"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
total_files=0
parse_errors=0
highlight_errors=0

echo -e "${YELLOW}📁 Finding example files...${NC}"
if [ ! -d "examples" ]; then
    echo -e "${RED}❌ Examples directory not found!${NC}"
    exit 1
fi

example_files=(examples/*.hxml)
total_files=${#example_files[@]}
echo -e "${GREEN}✅ Found $total_files example files${NC}"

echo -e "\n${YELLOW}🔧 Testing parser functionality...${NC}"

# Test parsing
for file in "${example_files[@]}"; do
    filename=$(basename "$file")
    if npx tree-sitter parse "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Parse: $filename${NC}"
    else
        echo -e "${RED}❌ Parse: $filename${NC}"
        npx tree-sitter parse "$file" 2>&1 | grep -E "(ERROR|Parse:)" || true
        parse_errors=$((parse_errors + 1))
    fi
done

echo -e "\n${YELLOW}🎨 Testing syntax highlighting...${NC}"

# Test highlighting
for file in "${example_files[@]}"; do
    filename=$(basename "$file")
    if npx tree-sitter query queries/highlights.scm "$file" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Highlight: $filename${NC}"
    else
        echo -e "${RED}❌ Highlight: $filename${NC}"
        highlight_errors=$((highlight_errors + 1))
    fi
done

echo -e "\n${YELLOW}📊 Testing detailed parsing...${NC}"

# Check for any ERROR nodes in the parse trees
error_files=0
for file in "${example_files[@]}"; do
    filename=$(basename "$file")
    if npx tree-sitter parse "$file" 2>&1 | grep -q "ERROR"; then
        echo -e "${RED}⚠️  Parse errors found in: $filename${NC}"
        npx tree-sitter parse "$file" 2>&1 | grep "ERROR" || true
        error_files=$((error_files + 1))
    fi
done

echo -e "\n${YELLOW}🧪 Testing grammar coverage...${NC}"

# Test specific complex examples
complex_files=("examples/advanced.hxml" "examples/edge-cases.hxml" "examples/multiplatform.hxml")
coverage_errors=0

for file in "${complex_files[@]}"; do
    filename=$(basename "$file")
    if [ -f "$file" ]; then
        if npx tree-sitter parse "$file" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Coverage: $filename${NC}"
        else
            echo -e "${RED}❌ Coverage: $filename${NC}"
            coverage_errors=$((coverage_errors + 1))
        fi
    else
        echo -e "${YELLOW}⚠️  Coverage file not found: $filename${NC}"
    fi
done

# Summary
echo -e "\n${YELLOW}📋 Test Summary${NC}"
echo "=============="
echo "Total files: $total_files"
echo "Parse errors: $parse_errors"
echo "Highlight errors: $highlight_errors"
echo "Files with ERROR nodes: $error_files"
echo "Coverage errors: $coverage_errors"

# Exit status
total_errors=$((parse_errors + highlight_errors + coverage_errors))
if [ $total_errors -eq 0 ] && [ $error_files -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed successfully!${NC}"
    exit 0
else
    echo -e "\n${RED}💥 $total_errors test(s) failed, $error_files file(s) with parse errors${NC}"
    exit 1
fi