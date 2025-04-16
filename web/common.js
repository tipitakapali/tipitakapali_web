//// tipitakapali.org commons.js
export const fewConvertedScript = ["si", "my", "hi", "thai"]

export const scriptFonts = {
  //// key: ["--pali-font", "--pali-font-size", "--pali-line-height = 150%"],
  si: ["UN-Abhaya", "", ""],
  my: ["Pyidaungsu", "", ""],
  hi: ["Noto Sans Devanagari", "", ""],
  ro: ["Noto Sans", "", ""],
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

  //// brah does not have a bold variant font
  brah: ["Noto Sans Brahmi", "", ""],
  tibt: ["Noto Serif Tibetan", "", ""],
  cyrl: ["Noto Sans", "", ""],
}

export function loadFonts(paliScript) {
  const fontFamily = scriptFonts[paliScript][0]
  const style = document.createElement("style")

  let textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: local("${fontFamily}"),
                 url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
        @font-face {
            font-family: ${fontFamily};
            src: local("${fontFamily}"),
                 url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Bold.ttf") format("truetype");
            font-weight: bold;
            font-display: swap;
        }
    `

  if ("brah" == paliScript) {
    //// can not find the bold font
    console.log("brah script has no bold tff file")
    textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: local("${fontFamily}"),
                 url("../web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
    `
  }

  style.textContent = textContent
  document.head.appendChild(style)
}

export const apiUrls = {
  dpdAPIURL: `https://api.tipitakapali.org/api/dpd`,
  declAPIURL: `https://api.tipitakapali.org/api/dec`,
  conjuAPIURL: `https://api.tipitakapali.org/api/conju`,
  abhiDhanAPIURL: `https://api.tipitakapali.org/api/abd`,
  wmSanskritAPIURL: `https://api.tipitakapali.org/api/sans`,
  ftsAPIURL: "https://api.tipitakapali.org/api/fts",
}

export function preparePostOp(postObj) {
  return {
    method: "POST",

    // headers: {
    //   "Content-Type": "application/json",
    //   "Accept-Encoding": "gzip, deflate",
    // },
    // body: JSON.stringify(postObj),

    headers: {
      //// use this to avoid preflight
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(postObj).toString(),
  }
}

export function typeVelthuis(uType) {
  /* 2017, updated 20 Dec 2020 */
  return uType
    .replace(/aa/g, "ā")
    .replace(/ii/g, "ī")
    .replace(/uu/g, "ū")
    .replace(/m\.\./g, "ṁ")
    .replace(/\.m/g, "ṃ")
    .replace(/\.n/g, "ṇ")
    .replace(/\.d/g, "ḍ")
    .replace(/\.l/g, "ḷ")
    .replace(/\.r/g, "ṛ")
    .replace(/\.s/g, "ṣ")
    .replace(/s\.\./g, "ś")
    .replace(/\.t/g, "ṭ")
    .replace(/,,n/g, "ñ")
    .replace(/n\.\./g, "ṅ")
    .replace(/AA/g, "Ā")
    .replace(/II/g, "Ī")
    .replace(/UU/g, "Ū")
    .replace(/M\.\./g, "Ṁ")
    .replace(/\.M/g, "Ṃ")
    .replace(/\.N/g, "Ṇ")
    .replace(/\.D/g, "Ḍ")
    .replace(/\.L/g, "Ḷ")
    .replace(/\.R/g, "Ṛ")
    .replace(/\.S/g, "Ṣ")
    .replace(/S\.\./g, "Ś")
    .replace(/\.T/g, "Ṭ")
    .replace(/,,N/g, "Ñ")
    .replace(/N\.\./g, "Ṅ")
}
