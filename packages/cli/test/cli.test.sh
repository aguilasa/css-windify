#!/bin/bash

# CLI Integration Tests for css-windify
# Tests basic functionality of the CLI tool

set -e

CLI_PATH="../dist/index.js"
FIXTURES_DIR="./fixtures"
OUTPUT_DIR="./output"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "Running CSS-Windify CLI Integration Tests..."
echo "=============================================="
echo ""

# Test 1: File input with JSON output
echo "Test 1: File input with JSON output"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json > "$OUTPUT_DIR/test1.json"
if [ -f "$OUTPUT_DIR/test1.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test1.json"; then
    echo -e "${GREEN}✓ Test 1 passed${NC}"
else
    echo -e "${RED}✗ Test 1 failed${NC}"
    exit 1
fi
echo ""

# Test 2: File input with Markdown output (default)
echo "Test 2: File input with Markdown output"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" > "$OUTPUT_DIR/test2.md"
if [ -f "$OUTPUT_DIR/test2.md" ] && grep -q "CSSWindify Conversion Report" "$OUTPUT_DIR/test2.md"; then
    echo -e "${GREEN}✓ Test 2 passed${NC}"
else
    echo -e "${RED}✗ Test 2 failed${NC}"
    exit 1
fi
echo ""

# Test 3: Stdin input with JSON output
echo "Test 3: Stdin input with JSON output"
cat "$FIXTURES_DIR/button.css" | node "$CLI_PATH" --report json > "$OUTPUT_DIR/test3.json"
if [ -f "$OUTPUT_DIR/test3.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test3.json"; then
    echo -e "${GREEN}✓ Test 3 passed${NC}"
else
    echo -e "${RED}✗ Test 3 failed${NC}"
    exit 1
fi
echo ""

# Test 4: Strict mode flag
echo "Test 4: Strict mode flag"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --strict --report json > "$OUTPUT_DIR/test4.json"
if [ -f "$OUTPUT_DIR/test4.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test4.json"; then
    echo -e "${GREEN}✓ Test 4 passed${NC}"
else
    echo -e "${RED}✗ Test 4 failed${NC}"
    exit 1
fi
echo ""

# Test 5: Approximate mode flag
echo "Test 5: Approximate mode flag"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --approximate --report json > "$OUTPUT_DIR/test5.json"
if [ -f "$OUTPUT_DIR/test5.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test5.json"; then
    echo -e "${GREEN}✓ Test 5 passed${NC}"
else
    echo -e "${RED}✗ Test 5 failed${NC}"
    exit 1
fi
echo ""

# Test 6: Custom thresholds
echo "Test 6: Custom thresholds"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --thresholds.spacing 4 --thresholds.font 2 --report json > "$OUTPUT_DIR/test6.json"
if [ -f "$OUTPUT_DIR/test6.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test6.json"; then
    echo -e "${GREEN}✓ Test 6 passed${NC}"
else
    echo -e "${RED}✗ Test 6 failed${NC}"
    exit 1
fi
echo ""

# Test 7: Custom screens
echo "Test 7: Custom screens"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --screens "sm:480,md:768,lg:1024" --report json > "$OUTPUT_DIR/test7.json"
if [ -f "$OUTPUT_DIR/test7.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test7.json"; then
    echo -e "${GREEN}✓ Test 7 passed${NC}"
else
    echo -e "${RED}✗ Test 7 failed${NC}"
    exit 1
fi
echo ""

# Test 8: Verify JSON structure
echo "Test 8: Verify JSON structure"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json > "$OUTPUT_DIR/test8.json"
if grep -q "\"meta\"" "$OUTPUT_DIR/test8.json" && \
   grep -q "\"results\"" "$OUTPUT_DIR/test8.json" && \
   grep -q "\"summary\"" "$OUTPUT_DIR/test8.json" && \
   grep -q "\"stats\"" "$OUTPUT_DIR/test8.json"; then
    echo -e "${GREEN}✓ Test 8 passed${NC}"
else
    echo -e "${RED}✗ Test 8 failed${NC}"
    exit 1
fi
echo ""

# Test 9: Verify ordered classes in output
echo "Test 9: Verify ordered classes in output"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json > "$OUTPUT_DIR/test9.json"
if grep -q "\"classes\":" "$OUTPUT_DIR/test9.json"; then
    echo -e "${GREEN}✓ Test 9 passed${NC}"
else
    echo -e "${RED}✗ Test 9 failed${NC}"
    exit 1
fi
echo ""

# Test 10: Verify summary is included
echo "Test 10: Verify summary is included"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json > "$OUTPUT_DIR/test10.json"
if grep -q "\"totals\"" "$OUTPUT_DIR/test10.json" && \
   grep -q "\"byCategory\"" "$OUTPUT_DIR/test10.json" && \
   grep -q "\"warningsByCategory\"" "$OUTPUT_DIR/test10.json"; then
    echo -e "${GREEN}✓ Test 10 passed${NC}"
else
    echo -e "${RED}✗ Test 10 failed${NC}"
    exit 1
fi
echo ""

# Test 11: --output flag with JSON
echo "Test 11: --output flag with JSON"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json --output "$OUTPUT_DIR/test11-output.json" 2>&1 | grep -q "Output written"
if [ -f "$OUTPUT_DIR/test11-output.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test11-output.json"; then
    echo -e "${GREEN}✓ Test 11 passed${NC}"
else
    echo -e "${RED}✗ Test 11 failed${NC}"
    exit 1
fi
echo ""

# Test 12: --output flag with Markdown
echo "Test 12: --output flag with Markdown"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --output "$OUTPUT_DIR/test12-output.md" 2>&1 | grep -q "Output written"
if [ -f "$OUTPUT_DIR/test12-output.md" ] && grep -q "CSSWindify Conversion Report" "$OUTPUT_DIR/test12-output.md"; then
    echo -e "${GREEN}✓ Test 12 passed${NC}"
else
    echo -e "${RED}✗ Test 12 failed${NC}"
    exit 1
fi
echo ""

# Test 13: --min-coverage with passing coverage (should exit 0)
echo "Test 13: --min-coverage with passing coverage"
if node "$CLI_PATH" "$FIXTURES_DIR/button.css" --min-coverage 50 --report json > "$OUTPUT_DIR/test13.json" 2>&1; then
    echo -e "${GREEN}✓ Test 13 passed (exit code 0)${NC}"
else
    echo -e "${RED}✗ Test 13 failed (expected exit code 0)${NC}"
    exit 1
fi
echo ""

# Test 14: --min-coverage with failing coverage (should exit 1)
echo "Test 14: --min-coverage with failing coverage"
if node "$CLI_PATH" "$FIXTURES_DIR/button.css" --min-coverage 99.9 --report json > "$OUTPUT_DIR/test14.json" 2>&1; then
    echo -e "${RED}✗ Test 14 failed (expected exit code 1)${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Test 14 passed (exit code 1)${NC}"
fi
echo ""

# Test 15: --output and --min-coverage combined
echo "Test 15: --output and --min-coverage combined"
node "$CLI_PATH" "$FIXTURES_DIR/button.css" --report json --output "$OUTPUT_DIR/test15-combined.json" --min-coverage 50 2>&1 | grep -q "Output written"
if [ -f "$OUTPUT_DIR/test15-combined.json" ] && grep -q "\"selector\"" "$OUTPUT_DIR/test15-combined.json"; then
    echo -e "${GREEN}✓ Test 15 passed${NC}"
else
    echo -e "${RED}✗ Test 15 failed${NC}"
    exit 1
fi
echo ""

echo "=============================================="
echo -e "${GREEN}All tests passed!${NC}"
echo ""
echo "Sample outputs saved in: $OUTPUT_DIR"
