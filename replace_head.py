import os
import argparse
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

    # Find the head section
    head_pattern = re.compile(r'(<head.*?>)(.*?)(</head>)', re.DOTALL | re.IGNORECASE)
    
    def replace_gt(match):
        head_start = match.group(1)
        head_content = match.group(2)
        head_end = match.group(3)
        
        # Replace &gt; with -
        new_head_content = head_content.replace('&gt;', '-')
        
        return f"{head_start}{new_head_content}{head_end}"
    
    new_content, count = head_pattern.subn(replace_gt, content)
    
    if count > 0 and new_content != content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
            return True
        except Exception as e:
            print(f"Error writing to {filepath}: {e}")
            return False
            
    return False

def main():
    parser = argparse.ArgumentParser(description='Replace "&gt;" with "-" in the <head> section of all HTML files in a directory.')
    parser.add_argument('input_dir', help='Input directory containing HTML files')
    
    args = parser.parse_args()
    
    input_dir = args.input_dir
    
    if not os.path.isdir(input_dir):
        print(f"Error: {input_dir} is not a valid directory.")
        return

    total_processed = 0
    total_updated = 0

    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.lower().endswith('.html') or file.lower().endswith('.htm'):
                filepath = os.path.join(root, file)
                total_processed += 1
                if process_file(filepath):
                    total_updated += 1
                    
    print(f"\nTotal files processed: {total_processed}")
    print(f"Total files updated: {total_updated}")

if __name__ == '__main__':
    main()
