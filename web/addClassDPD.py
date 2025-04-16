import re

def add_class_to_selectors(input_file, output_file, class_name):
    with open(input_file, 'r') as file:
        css_content = file.read()

    # Use regex to find all selectors and prepend the class
    updated_css_content = re.sub(r'(^|\s+)([^\{\}]+)\s*\{', rf'\1.{class_name} \2 {{', css_content)

    with open(output_file, 'w') as file:
        file.write(updated_css_content)


input_file = './dpd_css/deconstructor.css'  # Replace with your input file name
output_file = 'dp8.css'  # Replace with your desired output file name
class_name = 'dp8'
add_class_to_selectors(input_file, output_file, class_name)


input_file = 'dpd_css/dpd.css'  # Replace with your input file name
output_file = 'dp9.css'  # Replace with your desired output file name
class_name = 'dp9'
add_class_to_selectors(input_file, output_file, class_name)




print("You still need to edit manually")
