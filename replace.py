import os
from bs4 import BeautifulSoup

def replace_newlines(directory):
    """
    Replaces multiple consecutive newlines with a single newline in HTML files within a directory.

    Args:
        directory: The path to the directory containing the HTML files.
    """

    n = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            print(f"Processing: {filepath}")

            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                # Parse HTML with BeautifulSoup
                soup = BeautifulSoup(content, 'html.parser')
                
                # Find all <a> tags with name attribute
                for a_tag in soup.find_all('a', attrs={'name': True}):
                    # Get the name attribute value
                    name_value = a_tag['name']
                    # Set id attribute to the name value
                    a_tag['id'] = name_value
                    # Remove the name attribute
                    del a_tag['name']

                # Convert back to string, preserving original formatting
                modified_content = str(soup)

                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(modified_content)

                n += 1
                print(f"{n}.  Successfully modified: {filepath}")

            except Exception as e:
                print(f"  Error processing {filepath}: {e}")

# Specify the directory
directory_path = "chapter"
directory_path = "book"


# Check if the directory exists
if os.path.exists(directory_path) and os.path.isdir(directory_path):
    replace_newlines(directory_path)
    print("Done replacing tasks.")
else:
    print(f"Error: Directory '{directory_path}' not found or is not a directory.")

