from datetime import datetime
import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

# Read URLs from sitemap_full.txt
urls = []
with open("sitemap_full.txt", "r", encoding="utf-8") as f:
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
rough_string = ET.tostring(urlset, encoding='unicode')
parsed = minidom.parseString(rough_string)
pretty_xml = parsed.toprettyxml(indent="  ", newl="\n")

# Remove the extra XML declaration added by toprettyxml
pretty_xml = pretty_xml.split("\n", 1)[1] if pretty_xml.startswith("<?xml") else pretty_xml

# Write to file
with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write(pretty_xml)
    print("Done")