// file theme_dev.js

var currentScript2char = localStorage.getItem("tipitakapali_org_paliScript") || "ro"

var FONT_SIZE_MULTIPLIER_KEY = "tipitakapali_org_fontSizeMultiplier";
var currentFontSizeMultiplier = localStorage.getItem(FONT_SIZE_MULTIPLIER_KEY) || "1"; // Default font size multiplier

const scriptK3ys = ["si", "my", "hi", "thai", "laos", "km", "beng", "gurm", "guja", "telu", "kann", "mala", "tham", "brah", "tibt", "cyrl"]
const urlVisiting = window.location.href
const isReadingBook = urlVisiting.includes("book/")
const isReadingChapter = urlVisiting.includes("chapter/")

const urlParts = urlVisiting.split("/")
const urlFileName = urlParts.pop()
const isScriptInFileName = scriptK3ys.some((scrip) => urlFileName.startsWith(scrip + "."))

if (currentScript2char !== "ro") {
  //// handle redirect if not using correct URL

  if (isReadingBook) {
    //// all main books are converted into 17 scripts so do redirect if not using the link
    //// need to add "." to prevent cases where filenames are beginning with the script
    if (!isScriptInFileName) {
      const newUrl = urlParts.join("/") + `/${currentScript2char}.` + urlFileName
      window.location.href = newUrl
    } else {
      const theScriptChar = urlFileName.slice(0, urlFileName.indexOf("."))
      if (currentScript2char !== theScriptChar) {
        currentScript2char = theScriptChar
      }
    }
  } else if (isReadingChapter) {
    const fewConvertedScript = ["si", "my", "hi", "thai"]

    if (fewConvertedScript.includes(currentScript2char)) {
      if (!fewConvertedScript.some((scrip) => urlFileName.startsWith(scrip + "."))) {
        const newUrl = urlParts.join("/") + `/${currentScript2char}.` + urlFileName
        window.location.href = newUrl
      } else {
        currentScript2char = urlFileName.slice(0, urlFileName.indexOf("."))
      }
    } else {
      //// Should use the URL from the UI, if not redirect
      //// Converting from sinh is much faster
      const isUsingSinhURLFromUI = urlFileName.startsWith("si.")
      if (!isUsingSinhURLFromUI) {
        const newUrl = urlParts.join("/") + `/si.` + urlFileName
        window.location.href = newUrl
      }
    }
  }
} else if (currentScript2char === "ro" && isScriptInFileName) {
  currentScript2char = urlFileName.slice(0, urlFileName.indexOf("."))
}

const scriptFonts = {
  // si: ["--pali-font", "--pali-font-size", "--pali-line-height = 150%"],
  si: ["UN-Abhaya", "", ""],
  // my: ["Noto Sans Myanmar", "", "150%"],
  my: ["Pyidaungsu", "", ""],
  hi: ["Noto Sans Devanagari", "", ""],
  ro: ["Noto Sans", "", ""],
  // thai: ["TH Sarabun New", "", ""],
  thai: ["THSarabunPali", "2rem", ""],
  laos: ["Noto Sans Lao", "", ""],
  km: ["Noto Sans Khmer", "", ""],
  beng: ["Noto Sans Bengali", "", ""],
  gurm: ["Noto Sans Gurmukhi", "", ""],
  guja: ["Noto Sans Gujarati", "", ""],
  telu: ["Noto Sans Telugu", "", ""],
  kann: ["Noto Sans Kannada", "", ""],
  mala: ["Noto Sans Malayalam", "", ""],
  tham: ["Noto Sans Tai Tham", "", ""],
  brah: ["Noto Sans Brahmi", "", ""], // Brahmi does not have a bold variant font
  tibt: ["Noto Serif Tibetan", "", ""],
  cyrl: ["Noto Sans", "", ""],
}

function loadFonts(paliScript) {
  const fontFamily = scriptFonts[paliScript][0]
  const style = document.createElement("style")

  let textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
        @font-face {
            font-family: ${fontFamily};
            src: url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Bold.ttf") format("truetype");
            font-weight: bold;
            font-display: swap;
        }
    `

  if ("brah" == paliScript) {
    //// brah has no bold font
    console.log("brah script has no bold tff file")

    textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
    `
  }

  style.textContent = textContent
  document.head.appendChild(style)
}

if (currentScript2char !== "ro" && !["si", "my", "hi", "thai"].includes(currentScript2char)) {
  // The CSS defined in the HTML will load the font for the current script.
  // However, for scripts that have not been converted yet, the "si" HTML is used,
  // This if ensures that the font family in "si" is replaced
  // the default styles for scripts that are still in the process of conversion.

  loadFonts(currentScript2char)
  const P = scriptFonts[currentScript2char]
  document.documentElement.style.setProperty("--pali-font", P[0])
  if (P[1]) document.documentElement.style.setProperty("--pali-font-size", P[1])
  if (P[2]) document.documentElement.style.setProperty("--pali-line-height", P[2])
}

if (localStorage.getItem("tipitakapali_org_isDarkMode") == "yes") {
  document.documentElement.style.setProperty("--page-background", "#1f2022")
  document.documentElement.style.setProperty("--pali-color", "#e8e6e3")
  document.head.insertAdjacentHTML("beforeEnd", `<style>.phraseword{color:yellow;}.tmmAbhidhan .definition{color:#e8e6e3;}</style>`)
}

if (localStorage.getItem("tipitakapali_org_showPageMarker") == "yes") {
  document.documentElement.style.setProperty("--pinfo-display", "inline")
}


document.documentElement.style.setProperty("--font-size-multiplier", currentFontSizeMultiplier);


