import os
import glob
import re
import argparse

FROM_VERSION = "_v3"
TO_VERSION = "_v4"

def replace_version(directory):
    """
    Recursively scans the directory for HTML files and replaces
    occurrences of FROM_VERSION to TO_VERSION in file names and content.
    """
    html_files = glob.glob(os.path.join(directory, '**/*.html'), recursive=True)
    updated_count = 0
    
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Match "web/..._v3.css" and replace with "web/..._v4.css"
        new_content = re.sub(rf'(web/[^"\'\s<>]*?){FROM_VERSION}\.css', rf'\1{TO_VERSION}.css', content)
        # Match "web/..._v3.js" and replace with "web/..._v4.js"
        new_content = re.sub(rf'(web/[^"\'\s<>]*?){FROM_VERSION}\.js', rf'\1{TO_VERSION}.js', new_content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
            updated_count += 1
    print(f"\nTotal files updated: {updated_count}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=f"Replace {FROM_VERSION} to {TO_VERSION} in HTML files")
    parser.add_argument("directory", nargs="?", default=".", help="Directory to scan for HTML files (defaults to current directory)")
    args = parser.parse_args()
    
    target_dir = os.path.abspath(args.directory)
    print(f"Scanning directory: {target_dir}")
    replace_version(target_dir)
