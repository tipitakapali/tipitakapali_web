import os


"""
<script defer="" src="../web/handleClick.js"></script>
<script defer="" src="../web/renderer.js"></script>
"""
def replace_content_in_files(directory):
    if not os.path.exists(directory):
        print(f"Directory '{directory}' not found!")
        return
    
    f1 = '<script defer="" src="../web/paliscriptconverter_edited.js"></script>'
    r1= f'<script defer="" src="../web/matn.js"></script>\n{f1}'

    f2 = '<script defer="" src="../web/renderer.js"></script>'
    r2 = ''

    f3 = '<script defer="" src="../web/paliscriptconverter_edited.js"></script><script defer="" src="../web/handleClick.js"></script>'
    r3 = '<script defer="" src="../web/paliscriptconverter_edited.js"></script>\n<script defer="" src="../web/handleClick.js"></script>'

    files = sorted([f for f in os.listdir(directory) if f.endswith(".html")])
    print(f"Files to process: {len(files)}")

    z = 0

    for file in files:
        file_path = os.path.join(directory, file)

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        if f1 in content:
            content = content.replace(f1, r1)
        else:
            print(f"{z}. Skipped no script converter: {file_path}")
        
        if f2 in content:
            content = content.replace(f2, r2)
        else:
            print(f"{z}. Skipped no renderer: {file_path}")
        
        if f3 in content:
            content = content.replace(f3, r3)
        else:
            print(f"{z}. Skipped no one line: {file_path}")
        
        with open(file_path, "w", encoding="utf-8") as fo:
            fo.write(content)
            z += 1
    print(f"Total files processed: {z}")



if __name__ == "__main__":
    book_directory = "chapter"
    replace_content_in_files(book_directory)

    print("Process completed!")
