import __main__
import os
import shutil


def copy_files_to_copy_to_dir(old_dir, new_dir, copy_to_dir):
    # Create copy_to_dir if it doesn't exist
    os.makedirs(copy_to_dir, exist_ok=True)

    for root, dirs, files in os.walk(old_dir):
        # Calculate the relative path
        rel_path = os.path.relpath(root, old_dir)
        a2_root = os.path.join(new_dir, rel_path)
        copy_to_dir_root = os.path.join(copy_to_dir, rel_path)

        for file in files:
            a1_file = os.path.join(root, file)
            a2_file = os.path.join(a2_root, file)
            copy_to_dir_file = os.path.join(copy_to_dir_root, file)

            # Check if the file exists in A2
            if os.path.exists(a2_file):
                # Create the destination directory if it doesn't exist
                os.makedirs(os.path.dirname(copy_to_dir_file), exist_ok=True)
                # Copy the file from A2 to copy_to_dir
                shutil.copy2(a2_file, copy_to_dir_file)
                print(f"Copied: {a2_file} -> {copy_to_dir_file}")
            else:
                print(f"Error: File not found in A2: {a2_file}")


def replace_in_files(directory, replacements):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            file_path = os.path.join(root, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                file_content = file.read()
            for search_key, replace_key in replacements:
                file_content = file_content.replace(search_key, replace_key)

            # Write the new content back to the file
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(file_content)
            print(f"Processed: {file_path}")


if __name__ == "__main__":

    replacements = [[]]

    for idir in ["book", "chapter"]:
        # old = f"/home/p/pDEV/tipitakapali/production/tipitakapali_org_electron/cstpali/{idir}"  # Old folder
        # new = f"/home/p/pDEV/tipitakapali/production/tipitakapali_org_web/{idir}"  # New folder
        # copy_files_to_copy_to_dir(old, new, idir)
        replace_in_files(idir, replacements)
