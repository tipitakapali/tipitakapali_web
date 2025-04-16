import requests
import json
import time

## https://www.indexnow.org/documentation
sites = [
    # https://www.indexnow.org/faq
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://searchadvisor.naver.com/indexnow",
    "https://search.seznam.cz/indexnow",
    "https://yandex.com/indexnow",
    "https://indexnow.yep.com/indexnow",
]

your_key = "1ccd228f7820652a2ad36dbcde9c28f8"
key_location = "https://tipitakapali.org/1ccd228f7820652a2ad36dbcde9c28f8.txt"

# Read URLs from sitemap.txt
with open("sitemap.txt", "r", encoding="utf-8") as file:
    urls = [line.strip() for line in file.readlines()]

# Chunk URLs into batches of 9000
chunk_size = 9000
chunks = [urls[i:i + chunk_size] for i in range(0, len(urls), chunk_size)]

for chunk in chunks:
    # Prepare the JSON payload
    payload = {
        "host": "tipitakapali.org",
        "key": your_key,
        "keyLocation": key_location,
        "urlList": chunk,
    }

    for site in sites:
        print("---- Submitting to:", site)
        response = requests.post(site, json=payload)

        if response.status_code == 200:
            print("URLs submitted successfully. Response text:", response.text)
        else:
            print(f"Failed to submit URLs. Status code: {response.status_code}")
            print(response.text)
    
    # Sleep for a few seconds between chunks
    time.sleep(5)  # sleep for 5 seconds; adjust as necessary
