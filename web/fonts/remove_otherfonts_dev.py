import os
import re

def cleanup_fonts(root_dir):
    for dir_path, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.ttf'):
                full_path = os.path.join(dir_path, file)
                print(dir_path)
                
                # Check if the file is Bold or Regular
                if re.search(r'^[^-_]+-(?:Bold|Regular)\.ttf$', file) and '_' not in file:
                      print(f"Keeping: {full_path}")
                else:
                    try:
                        os.remove(full_path)
                        print(f"Deleted: {full_path}")
                    except OSError as e:
                        print(f"Error deleting {full_path}: {e}")

if __name__ == "__main__":
    font_dir = "./google"  # Replace this with the actual path to your font directory
    cleanup_fonts(font_dir)
    print("Font cleanup complete.")