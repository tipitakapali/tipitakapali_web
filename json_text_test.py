import json
from bs4 import BeautifulSoup
import re

def html_to_json(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    result = {
        "entries": [],
        "footnotes": []
    }
    
    footnote_count = 0

    def process_element(element):
        nonlocal footnote_count
        if isinstance(element, str):
            return element.strip()
        
        if element.name == 'a' and 'pinfo' in element.get('class', []):
            footnote_count += 1
            placeholder = f"{{footnote{footnote_count}}}"
            result["footnotes"].append({
                "type": "footnote",
                "text": f"{footnote_count}. {element.get('title', '')}"
            })
            return placeholder
        
        content = ''.join(process_element(child) for child in element.contents)
        
        if element.name in ['p', 'b']:
            return {
                "type": element.name,
                "class": element.get('class', ''),
                "text": content
            }
        
        return content

    for element in soup.find_all(['p', 'b']):
        processed = process_element(element)
        if isinstance(processed, dict):
            result["entries"].append(processed)

    return result

# Read HTML content from file
with open('./chapter/vin11t.nrf29.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

# Convert HTML to JSON
json_data = html_to_json(html_content)

# Save JSON to file
output_file = 'output.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(json_data, f, ensure_ascii=False, indent=4)

print(f"JSON data has been saved to {output_file}")