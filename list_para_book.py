import json
import os
from bs4 import BeautifulSoup


paras = {}


# def copy_book(si_dir):
#     # Create a new directory named 'book' and copy files
#     source_dir = "/home/p/pDEV/tipitakapali/production/tipitakapali_org_web/book"

#     book_dir = "book"
#     if not os.path.exists(book_dir):
#         os.makedirs(book_dir)

#     si_filenames = sorted([f for f in os.listdir(si_dir) if f.endswith(".html")])
#     n = 0
#     if os.path.exists(source_dir) and os.path.isdir(source_dir):
#         for file in os.listdir(source_dir):
#             if file.endswith(".html"):
#                 source_file = os.path.join(source_dir, file)
#                 dest_file = os.path.join(book_dir, file)
#                 if os.path.exists(source_file) and "si." + file in si_filenames:
#                     n += 1
#                     with open(source_file, "rb") as src, open(dest_file, "wb") as dst:
#                         dst.write(src.read())
#                     print(f"{n}. {file}: copied")



def list_book_para_id(directory):
    """
    Processes HTML files in a directory, extracts paragraph IDs,
    validates their sequence, and saves data to JSON files.
    """
    n = 0
    error_files = [] # Keep track of files with errors
    duplicated_files = [] # Keep track of files with duplicates

    try:
        ro_filenames = sorted([f for f in os.listdir(directory) if f.endswith(".html")])
    except OSError as e:
        print(f"Error reading directory '{directory}': {e}")
        return

    out_dir = "json"
    if not os.path.exists(out_dir):
        try:
            os.makedirs(out_dir)
            print(f"Created directory: {out_dir}")
        except OSError as e:
            print(f"Error creating directory '{out_dir}': {e}")
            return

    print(f"\nProcessing {len(ro_filenames)} HTML files from '{directory}'...")

    for filename in ro_filenames:
        filepath = os.path.join(directory, filename)
        # print(f"Processing: {filepath}") # Can be verbose, print only on error?
        
        # Use a local dictionary for each file's data
        file_paras_data = {}
        extracted_numbers = [] # Store extracted numbers here

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Parse HTML with BeautifulSoup
            soup = BeautifulSoup(content, "html.parser")

            # Find all <a> tags with id attribute starting with 'para' followed by digits
            for a_tag in soup.find_all("a", id=lambda x: x and x.startswith("para")):
                para_id = a_tag.get("id")
                if para_id and para_id[4:].isdigit(): # Check if rest are digits
                    no_str = para_id[4:]
                    if no_str: # Ensure there are digits after 'para'
                       extracted_numbers.append(int(no_str))

            n += 1

            # --- Validation Step ---
            is_sequential = False
            if not extracted_numbers:
                # If no paras found, it's trivially sequential (or an error depending on requirements)
                # print(f"  Info: {filename} - No 'para' anchors found.")
                is_sequential = True # Treat as valid if empty is okay
            else:
                sorted_numbers = sorted(extracted_numbers)
                # Expected sequence: [1, 2, 3, ..., len(sorted_numbers)]
                expected_sequence = list(range(1, len(sorted_numbers) + 1))

                if sorted_numbers == expected_sequence:
                    is_sequential = True
                else:
                    # Detailed error reporting
                    error_reason = []
                    # Check for duplicates
                    if len(sorted_numbers) != len(set(sorted_numbers)):
                         error_reason.append("duplicates found")
                         duplicated_files.append(filename)
                    # Check starting number
                    if sorted_numbers[0] != 1:
                         error_reason.append(f"starts with {sorted_numbers[0]}, not 1")
                    # Check for gaps (implicit if max != len after sorting and checking start/duplicates)
                    # A simpler check is just the sequence comparison failed
                    if not error_reason: # If no specific reason above, it must be gaps or wrong end number
                         error_reason.append("gaps or incorrect end number")

                    print(f"  ERROR: {filename} - Paragraph numbers not sequential (1 to n). Reason(s): {', '.join(error_reason)}.")
                    error_files.append(filename)


            # --- JSON Output Step ---
            # Store the *original* extracted numbers (or sorted, depending on need)
            file_paras_data[filename] = sorted(extracted_numbers) # Store sorted list

            # Write JSON only if needed, or perhaps only write valid ones?
            # Current code writes JSON regardless of validation result.
            each_json = filename.replace(".html", "")
            json_filepath = os.path.join(out_dir, f"{each_json}.json")
            try:
                with open(json_filepath, "w", encoding="utf-8") as f:
                    # Dump only the data for the current file
                    json.dump(file_paras_data, f, ensure_ascii=False, indent=None) # Using indent=None for compact JSON
                # print(f"{n}. Successfully processed: {filename} -> {json_filepath}")
            except IOError as e:
                print(f"  Error writing JSON for {filename}: {e}")
            except Exception as e:
                 print(f"  Unexpected error writing JSON for {filename}: {e}")


        except FileNotFoundError:
            print(f"  Error: File not found {filepath}")
        except UnicodeDecodeError as e:
            print(f"  Error decoding {filepath}: {e}. Try a different encoding if necessary.")
        except Exception as e:
            print(f"  Error processing {filepath}: {e}")

    print(f"\nFinished processing {n} files.")

   
    if error_files:
        print(f"Found sequence errors in {len(error_files)} file(s):")
        for err_file in error_files:
            print(f"  - {err_file}")
    else:
        print("All processed files had sequential paragraph numbers (1 to n).")
    print("\n----------\n\n\nDuplicated paraID:", duplicated_files)





if __name__ == "__main__":
    # print("Starting tasks...")
    # copy_book("si")

    directory_path = "book"
    if os.path.exists(directory_path) and os.path.isdir(directory_path):
        list_book_para_id(directory_path)
        print("Done tasks.")
    else:
        print(f"Error: Directory '{directory_path}' not found or is not a directory.")
    
