#!/bin/bash
set -e

BUILD_DIR="${1:-pejji-com/dist}"
ERRORS=0
WARNINGS=0

pass() { echo "  [PASS] $1"; }
fail() { echo "  [FAIL] $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo "  [WARN] $1"; WARNINGS=$((WARNINGS + 1)); }

echo "PEJJI SECURITY CHECK"
echo ""

echo "1. Build Output"
if [ -d "$BUILD_DIR" ] && [ -f "$BUILD_DIR/index.html" ]; then
  pass "Build exists"
else
  fail "No build output or missing index.html"
fi

echo ""
echo "2. Security Headers"
if [ -f "$BUILD_DIR/_headers" ] || [ -f "pejji-com/public/_headers" ]; then
  HF=$([ -f "$BUILD_DIR/_headers" ] && echo "$BUILD_DIR/_headers" || echo "pejji-com/public/_headers")
  for H in "Content-Security-Policy" "X-Frame-Options" "X-Content-Type-Options" "Referrer-Policy" "Permissions-Policy"; do
    if grep -qi "$H" "$HF"; then pass "$H"; else fail "Missing $H"; fi
  done
  if grep -qi "Strict-Transport-Security" "$HF"; then pass "HSTS"; else warn "Missing HSTS"; fi
else
  fail "No _headers file!"
fi

echo ""
echo "3. Secrets Scan"
SF=0
if grep -rn --include="*.html" --include="*.js" -E "(sk_live_|pk_live_|FLWSECK_|api[_-]?(key|secret)\s*[:=]\s*['\"][^'\"]{8,})" "$BUILD_DIR" 2>/dev/null; then
  fail "Secrets found in build output!"
  SF=1
fi
if [ $SF -eq 0 ]; then pass "No secrets"; fi

echo ""
echo "4. Error Pages"
if [ -f "$BUILD_DIR/404.html" ] || [ -f "$BUILD_DIR/404/index.html" ]; then
  pass "404 page exists"
else
  fail "No custom 404 page"
fi

echo ""
echo "5. Mixed Content"
if grep -rn --include="*.html" 'http://' "$BUILD_DIR" 2>/dev/null | grep -v 'w3.org\|xmlns\|schema.org\|localhost' | head -5; then
  warn "Potential mixed content found"
else
  pass "No mixed content"
fi

echo ""
echo "Results: $ERRORS errors, $WARNINGS warnings"
if [ $ERRORS -gt 0 ]; then
  echo "BLOCKED. Fix all FAIL items."
  exit 1
else
  echo "PASSED."
fi
