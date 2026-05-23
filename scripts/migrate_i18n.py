#!/usr/bin/env python3
"""Bulk-migrate `(appSettings.)?language === "es" ? X : Y` to `t(X, Y)`.

Only touches lines inside the AtlasLuthor component (line 1579+). Skips
the t() declaration itself (operands are identifiers, not strings).
"""
import re
import sys

PATH = "src/AtlasLuthor.jsx"
COMPONENT_LINE = 1579  # 1-indexed line where AtlasLuthor function starts

with open(PATH) as f:
    lines = f.readlines()

pre = "".join(lines[:COMPONENT_LINE - 1])
comp = "".join(lines[COMPONENT_LINE - 1:])

original_count = comp.count('language === "es"')

# Pattern: optional `appSettings.` prefix, then `language === "es"`, then `?`,
# then either a quoted string or a template literal, then `:`, then another
# quoted string or template literal. Whitespace (including newlines) allowed
# between tokens.
quoted = r'"(?:[^"\\]|\\.)*"'
templated = r'`(?:[^`\\]|\\.)*`'
operand = rf'(?:{quoted}|{templated})'
pattern = re.compile(
    rf'(?:appSettings\.)?language === "es"\s*\?\s*({operand})\s*:\s*({operand})',
    re.DOTALL,
)

def repl(match):
    return f't({match.group(1)}, {match.group(2)})'

new_comp, count = pattern.subn(repl, comp)
remaining = new_comp.count('language === "es"')

with open(PATH, "w") as f:
    f.write(pre + new_comp)

print(f"Replaced {count} occurrences. Remaining: {remaining}.")
print(f"Total before: {original_count}; after: {remaining}.")
