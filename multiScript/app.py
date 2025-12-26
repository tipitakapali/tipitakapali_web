
import re
from bs4 import BeautifulSoup
from javascript import require
import sys # Used for error exit

cvt = require("./cvt.js")

fromToThisPaliScr2Char = cvt.fromToThisPaliScr2Char
getLocaleNameForScript = cvt.getLocaleNameForScript

html_input = ""
with open("index_.html", "r", encoding="utf-8") as file:
    html_input = file.read()
parts = html_input.split("<!-- cst book starts here -->")

header = parts[0]
# header = header.replace('<link rel="stylesheet" href="web/index_v3.css">', '')
body = parts[1].split("<!-- cst book ends here -->")[0]
tail = parts[1].split("<!-- cst book ends here -->")[1]

CONVERT_TO = ["si", "my", "hi", "thai", "laos", "km", "beng", "gurm", "guja", "telu", "kann", "mala", "tham", "brah", "tibt", "cyrl"]
FEW_CONVERTED_SCRIPT = ["si", "my", "hi", "thai"]


def update_href(href, target_script):
    # For book links
    if href.startswith('book/'):
        # Check if the href already has a script prefix
        parts = href.replace('book/', '').split('.')
        if len(parts) > 1 and parts[0] in CONVERT_TO:
            # Already has a script prefix, replace it
            parts[0] = target_script
            return f"book/{'.'.join(parts)}"
        else:
            # No script prefix, add it
            return href.replace('book/', f'book/{target_script}.')
    
    # For chapter links
    elif href.startswith('chapter/'):
        # Check if the href already has a script prefix
        parts = href.replace('chapter/', '').split('.')
        if len(parts) > 1 and parts[0] in CONVERT_TO:
            # Already has a script prefix, replace it
            if target_script in FEW_CONVERTED_SCRIPT:
                parts[0] = target_script
            else:
                parts[0] = 'si'
            return f"chapter/{'.'.join(parts)}"
        else:
            # No script prefix, add it
            if target_script in FEW_CONVERTED_SCRIPT:
                return href.replace('chapter/', f'chapter/{target_script}.')
            else:
                return href.replace('chapter/', f'chapter/si.')
    
    return href

import math

# Create the two-column layout
def create_two_column_links(soup):
    links = soup.find_all('a')
    total_links = len(links)
    links_per_column = math.ceil(total_links / 2)
    
    linkstr = '<div style="display: flex; flex-wrap: wrap; width: 100%;">'
    
    # First column
    linkstr += '<div style="width: 48%; margin-right: 2%;">\n'
    linkstr += '  <ul style="list-style-type: none; padding-left: 0;">\n'
    for i in range(0, links_per_column):
        if i < total_links:
            linkstr += f"    <li>{str(links[i])}</li>\n"
    linkstr += "  </ul>\n</div>\n"
    
    # Second column
    linkstr += '<div style="width: 48%; margin-left: 2%;">\n'
    linkstr += '  <ul style="list-style-type: none; padding-left: 0;">\n'
    for i in range(links_per_column, total_links):
        linkstr += f"    <li>{str(links[i])}</li>\n"
    linkstr += "  </ul>\n</div>\n"
    
    linkstr += "</div>"
    return linkstr

def convert_pali_text(body, target_script):
    TAGS_TO_SKIP = ['script', 'style']
    conversion_count = 0
    error_count = 0
    soup = BeautifulSoup(body, "html.parser")
    for text_node in soup.find_all(string=True):
        if text_node.parent.name in TAGS_TO_SKIP:
            continue
        original_text = str(text_node)
        if not original_text.strip():
            continue
        try:
            converted_text = fromToThisPaliScr2Char(original_text, "ro", target_script)
            if converted_text != original_text:
                text_node.replace_with(converted_text)
                conversion_count += 1

        except Exception as e:
            error_count += 1
            print(f"\nWarning: Error converting text chunk:", file=sys.stderr)
            print(f"  Original: '{original_text[:80].strip()}...'", file=sys.stderr)
            print(f"  JS Error: {e}", file=sys.stderr)
    print(f"\nConversion complete. {conversion_count} text chunks converted. {error_count} errors encountered.", file=sys.stderr)

    for a in soup.find_all('a'):
        href = a.get('href')
        if href and href.startswith('book/'):
            a['href'] = update_href(href, target_script)
        elif href and href.startswith('chapter/'):
            a['href'] = update_href(href, target_script)
    #########################################  remove a tag chapter
    for a in soup.find_all('a', href=True):
        if a['href'].startswith('chapter/'):
            a.decompose() 
    li_elements = soup.find_all('li')
    for li in li_elements:
        if li.has_attr('class') and (not li['class'] or ''.join(li['class']) == ''):
            li.decompose()

    souphead = BeautifulSoup(header, "html.parser")

    css_link = souphead.new_tag('link')
    css_link['href'] = f'web/{target_script}_v2.css'
    css_link['rel'] = 'stylesheet'
    # Create a new script element for localStorage
    script = soup.new_tag('script')
    script.string = """
    document.addEventListener('DOMContentLoaded', function() {
        localStorage.setItem("tipitakapali_org_paliScript", "ro");
    });
    """

    # Add elements to the head if it exists, otherwise create a head
    # if soup.head:
    #     soup.head.append(css_link)
    #     soup.head.append(script)

    souphead.title.string =  fromToThisPaliScr2Char("Tipiṭaka Pāḷi", "ro", target_script) + " " + getLocaleNameForScript(target_script)+ " | " + fromToThisPaliScr2Char("Chaṭṭha Saṅgāyana Tipiṭaka", "ro", target_script)

    cst_name_div = souphead.find("div", id="cst_name")
    if cst_name_div:
        original_text = cst_name_div.get_text()
        converted_text = "File book list: " + fromToThisPaliScr2Char(original_text, "ro", target_script)
        cst_name_div.string = converted_text

    linkstr = '<div style="text-align: left;">'
    for link in soup.find_all('a'):
        linkstr += f"    <li>{str(link)}</li>\n"
    linkstr += "</div>"

    # linkstr = create_two_column_links(soup)

    
    with open(f"output/tipitaka_{target_script}.html", "w", encoding="utf-8") as file:
        file.write(str(souphead) + "<!-- cst book starts here -->" + linkstr + "<!-- cst book ends here -->" + tail)
    print(f"HTML file has been processed and saved as 'tipitaka_{target_script}.")


def main():
    for target_script in CONVERT_TO:
        convert_pali_text(body, target_script)

if __name__ == "__main__":
    main()