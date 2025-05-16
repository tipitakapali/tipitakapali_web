"""This script append version to the css and js to bypass Cloudflare caches

python3 append_version_to_resources.py -v 2 -r book
python3 append_version_to_resources.py -v 2 -r chapter
"""

import os
import argparse
import datetime
import shutil
import re
from collections import defaultdict
from bs4 import BeautifulSoup

def update_versioned_filename(filename, version):
    base, ext = os.path.splitext(filename)
    updated_base = re.sub(r'_v\d+$', '', base)  # Match _v followed by digits
    return f"{updated_base}_v{version}{ext}"


def append_version_to_assets(directory, version=2, rename_files=False):
    # BeautifulSoup behavior: it parses and re-serializes HTML, which can reorder attributes or alter formatting slightly
    # So using hybrid approach here
    if not version:
        version = datetime.datetime.now().strftime("%Y%m%d")

    changes = defaultdict(set)

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.html', '.htm')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    soup = BeautifulSoup(content, 'html.parser')
                    replacements = {}
                    modified = False

                    # Find all <link rel="stylesheet" href="...">
                    for tag in soup.find_all('link', rel='stylesheet'):
                        href = tag.get('href')
                        if href and href.endswith('.css'):
                            new_href = update_versioned_filename(href, version)
                            if new_href != href:
                                replacements[href] = new_href
                                changes['css'].add((href, new_href))
                                modified = True

                    # Find all <script src="...">
                    for tag in soup.find_all('script'):
                        src = tag.get('src')
                        if src and src.endswith('.js'):
                            new_src = update_versioned_filename(src, version)
                            if new_src != src:
                                replacements[src] = new_src
                                changes['js'].add((src, new_src))
                                modified = True

                    # Perform the replacements in the raw content
                    for old, new in replacements.items():
                        # Match both single and double quotes
                        content = re.sub(
                            rf'(["\']){re.escape(old)}(["\'])',
                            rf'\1{new}\2',
                            content
                        )

                    if modified:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated references in {file_path}")
                    else:
                        print(f"No changes needed in {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {str(e)}")

    if rename_files:
        rename_asset_files(directory, changes)

    return changes



def rename_asset_files(directory, changes):
    for file_type, file_changes in changes.items():
        for original, versioned in file_changes:
            # Always strip the version from the original path
            unversioned_original = re.sub(r'_v\d+(?=\.\w+$)', '', original)

            original_path = os.path.join(directory, unversioned_original.lstrip('/'))
            versioned_path = os.path.join(directory, versioned.lstrip('/'))

            os.makedirs(os.path.dirname(versioned_path), exist_ok=True)

            if os.path.exists(original_path):
                shutil.copy2(original_path, versioned_path)
                print(f"Copied {original_path} to {versioned_path}")
            else:
                print(f"Warning: Could not find original file {original_path}")


def print_changes_summary(changes):
    print("\n===== CHANGES SUMMARY =====")
    if not changes['css'] and not changes['js']:
        print("No changes were made.")
        return

    if changes['css']:
        print("\nCSS Files Modified:")
        for original, versioned in sorted(changes['css']):
            print(f"  {original} -> {versioned}")

    if changes['js']:
        print("\nJS Files Modified:")
        for original, versioned in sorted(changes['js']):
            print(f"  {original} -> {versioned}")

    print(f"\nTotal CSS files: {len(changes['css'])}")
    print(f"Total JS files: {len(changes['js'])}")
    print(f"Total changes: {len(changes['css']) + len(changes['js'])}")

def main():
    parser = argparse.ArgumentParser(description='Append or update _v{version} suffix for CSS and JS references in HTML files')
    parser.add_argument('directory', help='Directory containing HTML files to process')
    parser.add_argument('--version', '-v', help='Custom version string (default: current date YYYYMMDD)')
    parser.add_argument('--rename', '-r', action='store_true', help='Rename the actual CSS and JS files')

    args = parser.parse_args()

    if not os.path.isdir(args.directory):
        print(f"Error: {args.directory} is not a valid directory")
        return

    changes = append_version_to_assets(args.directory, args.version, args.rename)
    print_changes_summary(changes)
    print("\nProcessing complete!")

if __name__ == "__main__":
    main()