from datetime import datetime
from datetime import date
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom


def generate_sitemap_from_txt(sitemap_txt="sitemap.txt"):
    # Read URLs from sitemap.txt
    urls = []
    with open(sitemap_txt, "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f if line.strip()]

    # Create the root element
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    # Current date for lastmod
    current_date = datetime.now().strftime("%Y-%m-%d")

    # Add each URL to the sitemap
    for url in urls:
        url_element = ET.SubElement(urlset, "url")

        # Add loc
        loc = ET.SubElement(url_element, "loc")
        loc.text = url

        # Add lastmod (using current date as placeholder)
        lastmod = ET.SubElement(url_element, "lastmod")
        lastmod.text = current_date

        # Add changefreq (default to monthly)
        changefreq = ET.SubElement(url_element, "changefreq")
        changefreq.text = "monthly"

        # Add priority (default to 0.8)
        priority = ET.SubElement(url_element, "priority")
        priority.text = "0.8"

    # Convert to string with proper formatting
    rough_string = ET.tostring(urlset, encoding="unicode")
    parsed = minidom.parseString(rough_string)
    pretty_xml = parsed.toprettyxml(indent="  ", newl="\n")

    # Remove the extra XML declaration added by toprettyxml
    pretty_xml = (
        pretty_xml.split("\n", 1)[1] if pretty_xml.startswith("<?xml") else pretty_xml
    )

    # Write to file
    with open("sitemap2.xml", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write(pretty_xml)
        print("Done")


def modify_sitemap(sitemap_file_path):
    """
    Reverses the order of <url> elements in a sitemap.xml file
    and updates all <lastmod> dates to the current date.

    Args:
        sitemap_file_path (str): The absolute path to the sitemap.xml file.
    """
    try:
        # Get today's date in YYYY-MM-DD format
        today_date_str = date.today().strftime("%Y-%m-%d")

        # Define the namespace URI (from xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
        sitemap_ns_uri = "http://www.sitemaps.org/schemas/sitemap/0.9"

        # ElementTree uses Clark notation for tags with namespaces: {uri}tag
        url_tag = f"{{{sitemap_ns_uri}}}url"
        loc_tag = f"{{{sitemap_ns_uri}}}loc"
        lastmod_tag = f"{{{sitemap_ns_uri}}}lastmod"

        # Register the namespace with an empty prefix. This helps ElementTree
        # write the XML with the default namespace (xmlns="...") instead of ns0: prefixes.
        ET.register_namespace("", sitemap_ns_uri)

        # Parse the XML file
        tree = ET.parse(sitemap_file_path)
        root = tree.getroot()

        # Find all 'url' elements
        url_elements = root.findall(url_tag)

        # 1. Create a list of these elements and reverse it
        # We operate on a copy that's reversed.
        reversed_url_elements = list(url_elements)
        reversed_url_elements.reverse()

        # 2. Update 'lastmod' for each 'url' element in the reversed list
        for url_element in reversed_url_elements:
            lastmod_element = url_element.find(lastmod_tag)
            if lastmod_element is not None:
                lastmod_element.text = today_date_str
            else:
                # Optional: Handle missing <lastmod> tag if necessary
                loc_element = url_element.find(loc_tag)
                loc_text = (
                    loc_element.text if loc_element is not None else "Unknown URL"
                )
                print(
                    f"Warning: <lastmod> tag not found in URL: {loc_text}. It will not be updated."
                )

        # Clear existing 'url' elements from the root to re-insert them in the new order
        for child_url_element in root.findall(url_tag):
            root.remove(child_url_element)

        # Append the reversed and modified 'url' elements back to the root
        for url_element in reversed_url_elements:
            root.append(url_element)

        # Write the modified XML back to the file
        # encoding='UTF-8' and xml_declaration=True preserve the original format
        tree.write(sitemap_file_path, encoding="UTF-8", xml_declaration=True)

        print(f"Sitemap '{sitemap_file_path}' updated successfully.")
        print(f"  - URL list has been reversed.")
        print(f"  - All <lastmod> dates have been changed to {today_date_str}.")

    except FileNotFoundError:
        print(f"Error: Sitemap file not found at '{sitemap_file_path}'.")
    except ET.ParseError as e:
        print(f"Error: Could not parse XML from '{sitemap_file_path}'. Details: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    # The absolute path to your sitemap.xml file
    generate_sitemap_from_txt("sitemap.txt")
    
    # sitemap_xml_path = "sitemap.xml"
    # modify_sitemap(sitemap_xml_path)
