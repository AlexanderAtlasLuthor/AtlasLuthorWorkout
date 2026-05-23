#!/usr/bin/env python3
"""Replace an inline modal block in AtlasLuthor.jsx with a component call.

Usage: python3 swap_modal.py <start_line> <end_line> <replacement_file>
- start_line: 1-indexed first line of `      {<flag> && (`
- end_line: 1-indexed line of the matching `)}` (closing brace)
- replacement_file: path to a file containing the replacement JSX
"""
import sys

if len(sys.argv) != 4:
    sys.exit("usage: swap_modal.py START END REPLACEMENT_FILE")

SRC = "src/AtlasLuthor.jsx"
start = int(sys.argv[1])  # 1-indexed
end = int(sys.argv[2])    # 1-indexed
repl_path = sys.argv[3]

with open(SRC) as f:
    lines = f.readlines()

with open(repl_path) as f:
    replacement = f.read()
    if not replacement.endswith("\n"):
        replacement += "\n"

new_lines = lines[:start - 1] + [replacement] + lines[end:]
with open(SRC, "w") as f:
    f.writelines(new_lines)

print(f"Replaced lines {start}-{end} ({end - start + 1} lines) with content from {repl_path}.")
