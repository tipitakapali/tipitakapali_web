/**
 * This script generates CSS files for different scripts based on a template.
 * Input: web/tp_templete.css
 * Note: web/tp_dev.css is for the default roman pali css. It will be minified to tp.css.
 * Thus need to modify both web/tp_dev.css and web/templete.css
 */

const fs = require("fs")
const path = require("path")

const scriptFonts = {
  si: ["UN-Abhaya", "", ""],
  // my: ["Noto Sans Myanmar", "", "150%"],
  my: ["Pyidaungsu", "1.5rem", ""],
  hi: ["Noto Sans Devanagari", "", ""],
  // default ro tp.css
  tp: ["Noto Sans", "", ""],
  thai: ["TH Sarabun New", "2rem", ""],
  laos: ["Noto Sans Lao", "", ""],
  km: ["Noto Sans Khmer", "", ""],
  beng: ["Noto Sans Bengali", "", ""],
  gurm: ["Noto Sans Gurmukhi", "", ""],
  guja: ["Noto Sans Gujarati", "", ""],
  telu: ["Noto Sans Telugu", "", ""],
  kann: ["Noto Sans Kannada", "", ""],
  mala: ["Noto Sans Malayalam", "", ""],
  tham: ["Noto Sans Tai Tham", "", ""],
  brah: ["Noto Sans Brahmi", "", ""],
  tibt: ["Noto Serif Tibetan", "", ""],
  cyrl: ["Noto Sans", "", ""],
}

// Read the root.css template
const rootCssTemplate = fs.readFileSync("web/tp_templete.css", "utf8")

// Function to generate CSS content for a specific script
function generateCssContent(fontFamily, fontSize, lineHeight, ishideBody = false) {
  let cssContent = rootCssTemplate

  // Replace font-family
  cssContent = cssContent.replace("#1#", fontFamily)

  // Replace font-size if provided
  if (fontSize) {
    cssContent = cssContent.replace("--pali-font-size: calc(12pt + 0.8vw);", `--pali-font-size: ${fontSize};`)
  }

  // Replace line-height if provided
  if (lineHeight) {
    cssContent = cssContent.replace("--pali-line-height: 150%;", `--pali-line-height: ${lineHeight};`)
  }

  if (fontFamily !== "Noto Sans") {
    // Replace @font-face rules
    let hideBody = ""
    if (ishideBody) {
      hideBody = `
/* only in chapter si2.css converting */
body {display: none;}
      `
    }
    cssContent = cssContent.replace(
      "/*#AddPaliFF#*/",
      `@font-face {
  font-family: "${fontFamily}";
  src: url("fonts/pali/${fontFamily.replaceAll(" ", "_")}/static/${fontFamily.replaceAll(" ", "")}-Regular.ttf") format("truetype");
  font-weight: normal;
  font-display: swap;
}

@font-face {
  font-family: "${fontFamily}";
  src: url("fonts/pali/${fontFamily.replaceAll(" ", "_")}/static/${fontFamily.replaceAll(" ", "")}-Bold.ttf") format("truetype");
  font-weight: bold;
  font-display: swap;
}${hideBody}`
    )
  }

  return cssContent
}

// Generate CSS files for each script
let n = 0
for (const [script, [fontFamily, fontSize, lineHeight]] of Object.entries(scriptFonts)) {
  const cssContent = generateCssContent(fontFamily, fontSize, lineHeight)
  const outputPath = path.join("web", `${script}_dev.css`)

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })

  // Write the CSS content to the file
  fs.writeFileSync(outputPath, cssContent)
  n += 1
  console.log(`${n} Generated ${outputPath}`)

  if (script == "si") {
    const cssContent = generateCssContent(fontFamily, fontSize, lineHeight, true)
    const outputPath = path.join("web", `${script}2_dev.css`)

    // Ensure the output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })

    // Write the CSS content to the file
    fs.writeFileSync(outputPath, cssContent)
    n += 1
    console.log(`${n} Generated ${outputPath}`)
  }
}

console.log("CSS generation complete.")
