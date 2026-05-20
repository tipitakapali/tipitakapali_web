import os
import re



def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Parse Title
        title_match = re.search(r'<title>(.*?)</title>', content)
        if not title_match:
            return # Skip if no title
        
        original_title = title_match.group(1)
        parts = [p.strip() for p in original_title.split('&gt;')]
        
        if len(parts) >= 2:
            new_title = f"{parts[-1]} - {parts[-2]} | Tipiṭaka Pāḷi"
            new_desc = f"Read the {parts[-1]} section of the {parts[-2]} in various Pāḷi scripts and get instant dictionary definitions by clicking on any word. Explore and learn Tipiṭaka Pāḷi in the Chaṭṭha Saṅgāyana Tipiṭaka."
        elif len(parts) == 1:
            new_title = f"{parts[0]} | Tipiṭaka Pāḷi"
            new_desc = f"Read the {parts[0]} in various Pāḷi scripts and get instant dictionary definitions by clicking on any word. Explore and learn Tipiṭaka Pāḷi in the Chaṭṭha Saṅgāyana Tipiṭaka."
        else:
            return

        # Escape strings for regex sub, though doing simple string replacement is safer for large blocks
        # 2. Extract Canonical URL
        url_match = re.search(r'<meta\s+content="([^"]+)"\s+(?:property|name)="og:url"\s*/>', content)
        canonical_url = url_match.group(1) if url_match else ""

        # 3. Replacements
        # Using simple replace for exact match if we can, or re.sub
        content = re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', content)
        
        # Descriptions
        content = re.sub(r'<meta\s+content=".*?"\s+name="description"\s*/>', f'<meta content="{new_desc}" name="description"/>', content)
        
        # Open Graph & Twitter
        content = re.sub(r'<meta\s+content=".*?"\s+property="og:title"\s*/>', f'<meta content="{new_title}" property="og:title"/>', content)
        content = re.sub(r'<meta\s+content=".*?"\s+property="og:description"\s*/>', f'<meta content="{new_desc}" property="og:description"/>', content)
        content = re.sub(r'<meta\s+content=".*?"\s+name="twitter:title"\s*/>', f'<meta content="{new_title}" name="twitter:title"/>', content)
        content = re.sub(r'<meta\s+content=".*?"\s+name="twitter:description"\s*/>', f'<meta content="{new_desc}" name="twitter:description"/>', content)

        # 4. Insert Canonical Tag if missing
        if canonical_url and 'rel="canonical"' not in content:
            canonical_tag = f'<link href="{canonical_url}" rel="canonical"/>\n'
            # Insert just before </head>
            content = re.sub(r'(</head>)', rf'{canonical_tag}\1', content, count=1)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    target_dirs = ['book', 'chapter']
    base_path = '/Volumes/pnryApp1TB/dev_pnry/01_tipitakapali_web'
    
    count = 0
    for d in target_dirs:
        dir_path = os.path.join(base_path, d)
        if not os.path.exists(dir_path):
            continue
            
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.html'):
                    filepath = os.path.join(root, file)
                    process_file(filepath)
                    count += 1
                    if count % 500 == 0:
                        print(f"Processed {count} files...")
    print(f"Finished processing {count} files.")

if __name__ == "__main__":
    main()
