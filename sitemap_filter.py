def filter_sitemap_urls(filepath, output_filepath):
  """
  Reads a sitemap.txt file, filters URLs, and saves the result to a new file.

  Args:
    filepath: The path to the sitemap.txt file.
    output_filepath: The path to the file where the filtered URLs will be saved.
  """
  filtered_urls = []
  try:
    with open(filepath, 'r', encoding='utf-8') as file:
      for line in file:
        url = line.strip()
        if url.startswith("https://tipitakapali.org/book/"):
          filtered_urls.append(url)
  except FileNotFoundError:
    print(f"Error: File '{filepath}' not found.")
    return 
  filtered_urls.sort(key=len)
  try:
    with open(output_filepath, 'w', encoding='utf-8') as outfile:
      for url in filtered_urls:
        outfile.write(url + '\n')
    print(f"Filtered URLs saved to '{output_filepath}'")
  except Exception as e:
    print(f"Error writing to file '{output_filepath}': {e}")

# Example usage
filter_sitemap_urls("sitemap_full.txt", "new.txt") 