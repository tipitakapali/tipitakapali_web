import os

def generate_sitemap(directories):
    urls = []
    base_url = "https://tipitakapali.org"
    exceptions = ["book/index.html", "chapter/index.html"]

    for directory in directories:
        directory_urls = []
        if os.path.exists(directory):
            for filename in sorted(os.listdir(directory)):
                file_path = f"{directory}/{filename}"
                if filename.endswith(".html") and file_path not in exceptions:
                    # Remove the .html extension
                    page_name = os.path.splitext(filename)[0]
                    url = f"{base_url}/{directory}/{page_name}"
                    directory_urls.append(url)
        urls.extend(directory_urls)

    return urls

def write_sitemap(urls, output_file):
    man = """https://tipitakapali.org/
https://tipitakapali.org/index
https://tipitakapali.org/mula
https://tipitakapali.org/attha
https://tipitakapali.org/tika
https://tipitakapali.org/info
https://tipitakapali.org/download
https://tipitakapali.org/how-to-use-tipitakapali-video
https://tipitakapali.org/search"""
    man = man.strip()

    with open(output_file, "w") as f:
        done_text = man + "\n"+ "\n".join(urls)
        f.write(done_text)

if __name__ == "__main__":
    directories = ["book", "chapter"]
    urls = generate_sitemap(directories)
    write_sitemap(urls, "sitemap.txt")
    print(f"Sitemap generated with {len(urls)} URLs.")
