#!/usr/bin/env python3
"""Move the UI_TEXT dictionary (lines 381-1064) into src/lib/uiText.js."""
import sys

SRC = "src/AtlasLuthor.jsx"
DST = "src/lib/uiText.js"

with open(SRC) as f:
    lines = f.readlines()

START_MARKER = "const UI_TEXT = {\n"
start_idx = None
for i, line in enumerate(lines):
    if line == START_MARKER:
        start_idx = i
        break

if start_idx is None:
    sys.exit("UI_TEXT start not found")

# Find the matching closing `};` at column 0.
end_idx = None
for j in range(start_idx + 1, len(lines)):
    if lines[j] == "};\n":
        end_idx = j
        break

if end_idx is None:
    sys.exit("UI_TEXT end not found")

dict_lines = lines[start_idx:end_idx + 1]
dict_text = "".join(dict_lines)

# Write the module file: `export const UI_TEXT = {...};`
module_src = dict_text.replace("const UI_TEXT", "export const UI_TEXT", 1)
with open(DST, "w") as f:
    f.write(module_src)

# Replace the original block with an import line at the top, near other imports.
# The import will be added to AtlasLuthor.jsx separately.
new_lines = lines[:start_idx] + lines[end_idx + 1:]
with open(SRC, "w") as f:
    f.writelines(new_lines)

print(f"Moved lines {start_idx + 1}-{end_idx + 1} ({end_idx - start_idx + 1} lines) to {DST}.")
