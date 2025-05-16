#!/bin/bash

python3 gen_info.html.py

node genCSS.js

node min_html.js

echo "=================== Minifying JS ======================"
# Define the input directory
INPUTDIR="web"

# Find all _dev.js files in the input directory
for FILE in $(find "$INPUTDIR" -name "*_dev.js"); do
  # Define the output file by removing '_dev' from the filename
  OUTFILE="${FILE/_dev.js/.js}"
  
  # Run esbuild to minify the file, need to keep the function name since DPD button click will call it.
  npx esbuild "$FILE" --minify --keep-names --charset=utf8 --outfile="$OUTFILE"
  
  echo "Minified $FILE to $OUTFILE"
done


echo "==== Minifying all _dev.css files in web directory ===="

# Loop through all _dev.css files in the web directory
for file in web/*_dev.css; do
    # Get the base name of the file (without path)
    base=$(basename "$file")
    # Create the output file name by removing _dev from the base name
    output="web/${base/_dev/}"
    
    echo "Minifying $base to $(basename "$output")"
    
    # Run html-minifier on the file
    # npx html-minifier \
    #     --file-ext css \
    #     --decode-entities \
    #     --collapse-whitespace \
    #     --remove-comments \
    #     --output "$output" \
    #     "$file"
    # now using cssnano https://cssnano.github.io/cssnano/docs/getting-started/
    npx postcss "$file" > "$output"

done

echo "==== Minification css complete ===="

echo "Sadhu x3.14"
