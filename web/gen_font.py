import webbrowser


fonts = [
'Noto+Sans+Sinhala',
'Noto+Sans+Myanmar',
'Noto+Sans+Devanagari',
'Noto+Sans',
'Noto+Sans+Thai',
'Noto+Sans+Lao',
'Noto+Sans+Khmer',
'Noto+Sans+Bengali',
'Noto+Sans+Gurmukhi',
'Noto+Sans+Gujarati',
'Noto+Sans+Telugu',
'Noto+Sans+Kannada',
'Noto+Sans+Malayalam',
'Noto+Sans+Tai+Tham',
'Noto+Sans+Brahmi',
'Noto+Serif+Tibetan',
'Noto+Serif',
]

def open_browser():
    for font in fonts:
        url = f"https://fonts.google.com/noto/specimen/{font}"
        webbrowser.open(url)

def gen_css():
    t = ""
    for font in fonts:
        name = font.replace("+"," ")
        r = f"fonts/google/{font.replace("+", "_")}/static/{font.replace("+","")}-Regular.ttf"
        b = f"fonts/google/{font.replace("+", "_")}/static/{font.replace("+","")}-Bold.ttf"

        t += f"""
@font-face{{src:local("{name}"),url("{r}")format("truetype");font-display:swap;font-weight:normal;font-family:"{name}";}}
@font-face{{src:local("{name}"),url("{b}")format("truetype");font-display:swap;font-weight:bold;font-family:"{name}";}}

        """
    with open("font-face.css", "w", encoding="utf-8") as f:
        f.write(t)
    print("Done")

gen_css()
    
