import os
from pathlib import Path

allPaliScripts = ["si", "my", "hi", "thai"]

fix_vibhanga_anutika = {
    "abh02t.tik18.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 1. Khandhavibhaṅgo",
    "abh02t.tik19.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 2. Āyatanavibhaṅgo",
    "abh02t.tik20.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 3. Dhātuvibhaṅgo",
    "abh02t.tik21.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 4. Saccavibhaṅgo",
    "abh02t.tik22.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 5. Indriyavibhaṅgo",
    "abh02t.tik23.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 6. Paṭiccasamuppādavibhaṅgo",
    "abh02t.tik24.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 7. Satipaṭṭhānavibhaṅgo",
    "abh02t.tik25.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 8. Sammappadhānavibhaṅgo",
    "abh02t.tik26.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 9. Iddhipādavibhaṅgo",
    "abh02t.tik27.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 10. Bojjhaṅgavibhaṅgo",
    "abh02t.tik28.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 11. Maggaṅgavibhaṅgo",
    "abh02t.tik29.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 12. Jhānavibhaṅgo",
    "abh02t.tik30.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 13. Appamaññāvibhaṅgo",
    "abh02t.tik31.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 14. Sikkhāpadavibhaṅgo",
    "abh02t.tik32.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 15. Paṭisambhidāvibhaṅgo",
    "abh02t.tik33.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 16. Ñāṇavibhaṅgo",
    "abh02t.tik34.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 17. Khuddakavatthuvibhaṅgo",
    "abh02t.tik35.html": "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt; 18. Dhammahadayavibhaṅgo",
}

file_scripts = {}

for k, v in fix_vibhanga_anutika.items():
    file_scripts[k] = v
    for i in allPaliScripts:
        file_scripts[f"{i}.{k}"] = v


replace_dict = [
    (
        "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-mūlaṭīkā &gt;",
        "Tīkā &gt; Abhidhammapiṭaka (ṭīkā) &gt; Vibhaṅga-anuṭīkā &gt;",
    ),
    (
        "तीका &gt; अभिधम्मपिटक (टीका) &gt; विभङ्ग-मूलटीका &gt;",
        "तीका &gt; अभिधम्मपिटक (टीका) &gt; विभङ्ग-अनुटीका &gt;",
    ),
    (
        "တီကာ &gt; အဘိဓမ္မပိဋက (ဋီကာ) &gt; ဝိဘင်္ဂ-မူလဋီကာ &gt;",
        "တီကာ &gt; အဘိဓမ္မပိဋက (ဋီကာ) &gt; ဝိဘင်္ဂ-အနုဋီကာ &gt;",
    ),
    (
        "තීකා &gt; අභිධම්මපිටක (ටීකා) &gt; විභඞ්ග-මූලටීකා &gt;",
        "තීකා &gt; අභිධම්මපිටක (ටීකා) &gt; විභඞ්ග-අනුටීකා &gt;",
    ),
    (
        "ตีกา &gt; อภิธมฺมปิฏก (ฏีกา) &gt; วิภงฺค-มูลฏีกา &gt;",
        "ตีกา &gt; อภิธมฺมปิฏก (ฏีกา) &gt; วิภงฺค-อนุฏีกา &gt;",
    ),
]


def replace_vibhanga_title(chapter_dir: str) -> None:
    """
    Replace variations of Vibhaṅga-mūlaṭīkā with Vibhaṅga-anuṭīkā using `replace_dict`,
    only in files listed in `file_scripts`.

    Args:
        chapter_dir (str): Path to the directory containing HTML files
    """
    chapter_path = Path(chapter_dir)
    output_dir = Path("output")
    output_dir.mkdir(exist_ok=True)
    n = 0

    for file_path in chapter_path.glob("*.html"):
        if file_path.name not in file_scripts:
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
            updated = False

            for old, new in replace_dict:
                if old in content:
                    content = content.replace(old, new)
                    updated = True

            if updated:
                n += 1
                save_path = output_dir / file_path.name
                save_path.write_text(content, encoding="utf-8")
                print(f"{n}. Updated: {save_path}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")


# Example usage
if __name__ == "__main__":
    chapter_directory = "chapter"
    replace_vibhanga_title(chapter_directory)

