#!/bin/bash

#------------------------- provide update version here -----------------------------
updateVersion="_v4"
#-----------------------------------------------------------------------------------

python3 gen_info.html.py

node genCSS.js

node min_html.js

echo ""
echo "=================== Minifying JS ======================"


# Define the input directory
INPUTDIR="web"

# Find all _dev.js files in the input directory
for FILE in $(find "$INPUTDIR" -name "*_dev.js"); do
  # Define the output file by removing '_dev' from the filename
  OUTFILE="${FILE/_dev.js/.js}"
  OUTFILEVERSION="${FILE/_dev.js/}${updateVersion}.js"

  if [[ "$FILE" == *"paliscriptconverter_edited_dev.js" ]] || [[ "$FILE" == *"matn_dev.js" ]]; then
    cp "$FILE" "$OUTFILEVERSION"
    cp "$FILE" "$OUTFILE"
    echo "Copied $FILE to $OUTFILEVERSION, $OUTFILE"
  else
    # Run esbuild to minify the file, need to keep the function name since DPD button click will call it.
    npx esbuild "$FILE" --minify --keep-names --charset=utf8 --outfile="$OUTFILEVERSION"
    npx esbuild "$FILE" --minify --keep-names --charset=utf8 --outfile="$OUTFILE"
    
    echo "Minified $FILE to $OUTFILEVERSION, $OUTFILE"
  fi
done

echo ""
echo "==== Minifying all _dev.css files in web directory ===="

# Loop through all _dev.css files in the web directory
for file in web/*_dev.css; do
    # Get the base name of the file (without path)
    base=$(basename "$file")

    # Remove '_dev' from the filename
    no_dev="${base/_dev/}"

    # Insert version before .css
    output="web/${no_dev}"

    outputVersion="web/${no_dev%.css}${updateVersion}.css"

    
    # minify using cssnano https://cssnano.github.io/cssnano/docs/getting-started/
    

    echo "Minifying $base to $(basename "$outputVersion"), $(basename "$output")"
    npx postcss "$file" > "$outputVersion"
    npx postcss "$file" > "$output"


done

echo "==== Minification css complete ===="

echo "Sadhu x3.14"

echo "Warning updated JS CSS version is $updateVersion"

echo "File is named with $updateVersion"
