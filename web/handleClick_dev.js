/* eslint-disable no-unused-vars */
/*********************************
 * https://tipitakapali.org & offline apps
 * File: handleClick_dev.js

 * Date: 2017 - present
 * Authors: bkpannindriya @ gmail.com
 * Authors: Generative AIs and contributors
 * Last modified 2025.04.18
 *********************************/

//// mobileFlutter switch: false = electron, web, ios;
//// true = flutter, android

//// --------------------------
const isRunningOnMobileApp = false
//// --------------------------

let originalTitle = ""
let convertedTitle = ""
let buttonGoHome = ""
let dpd_feedback_s = ""
let abd_SansEle = ""

let shouldConvertFromSinh = true
var dpdLastClickEle = false
var nowToc = false
var stopWordClick = false
var nowDict = false
let isAbhidhanFetched = false
let isPTSFetched = false
let isSanskritFetched = false

let aiButton = true
let aiButtonMM = ""
let currentPEleForAI = null
let isPendingAITasks = false

let hlLastClickEle, currentPObj, topInputDisplayWord
let dpdLastClickButtonEl = null

var FONT_SIZE_MULTIPLIER_KEY = "tipitakapali_org_fontSizeMultiplier";
var currentFontSizeMultiplier = localStorage.getItem(FONT_SIZE_MULTIPLIER_KEY) || "1"; // Default font size multiplier


let aParaIdsInFile = null
const allPaliScripts = ["si", "my", "hi", "ro", "thai", "laos", "km", "beng", "gurm", "guja", "telu", "kann", "mala", "tham", "brah", "tibt", "cyrl"]

//// save space, only converted a few scripts

const dpdAPIURL = isRunningOnMobileApp ? "dpd" : "https://api.tipitakapali.org/api/dpd"
const infAPIURL = isRunningOnMobileApp ? "inf" : "https://api.tipitakapali.org/api/inf"
const abhiDhanAPIURL = isRunningOnMobileApp ? "abd" : "https://api.tipitakapali.org/api/abd"
const ptsAPIURL = isRunningOnMobileApp ? "pts" : "https://api.tipitakapali.org/api/pts"
const wmSanskritAPIURL = isRunningOnMobileApp ? "sans" : "https://api.tipitakapali.org/api/sans"
const aiAPIURL = "https://api.tipitakapali.org/v1/translator"

const STORAGE_SCRIPT_KEY = "tipitakapali_org_paliScript"
// const ABDtitle = "\ud83d\udcd1 အဘိဓာန်"
const ABDtitle = "\ud83d\udcd1 Abhidhan"
const PTStitle = "\ud83d\udcd1 PTSPED"
const sanskritStr = "\ud83d\udcd6 Sanskrit"
const notFoundHeadAbhidhan = `<div class="notFoundHead">\ud83d\ude0c Not found - ရှာမတွေ့ပါ။</div>`
const notFoundHeadPTS = `<div class="notFoundHead">\ud83d\ude0c PTS PED - Not found</div>`
const notFoundHeadSanskrit = `<div class="notFoundHead">\ud83d\ude0c Not found in this Sanskrit dictionary db.</div>`

const stripChars = '…‘ ’!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~' + "0123456789"

const romanPaliChars = "a-zA-ZāīūṅñṭḍṇḷṃṁṛṝśṣĀĪŪŊÑṬḌṆḶṂṀṚṜŚṢ√"
const nonRomanPaliCharsRex = new RegExp(`[^${romanPaliChars}]`)

//// do not strip the single quote '
//// many instances are in the synonym dict (m'evaṃ => mevaṃ)
const regExpSpacePunctuations = new RegExp(`[${stripChars}]+`, "g")
const regExpFeedbackDPDId = /#z3@(.*?)_fb@/g

// const reDPDLinks = [
// ru lang ["https://docs.google.com/forms/d/1iMD9sCSWFfJAFCFYuG9HRIyrr9KFRy0nAOVApM998wM/viewform", "L#1@"],
// sbs ["https://docs.google.com/forms/d/e/1FAIpQLScNC5v2gQbBCM3giXfYIib9zrp-WMzwJuf_iVXEMX2re4BFFw/viewform", "L#2@"],
//   ["https://docs.google.com/forms/d/e/1FAIpQLSdAL2PzavyrtXgGmtNrZAMyh3hV6g3fU0chxhWFxunQEZtH0g/viewform", "L#3@"],
//   ["https://docs.google.com/forms/d/e/1FAIpQLSf9boBe7k5tCwq7LdWgBHHGIPVc4ROO5yjVDo1X5LDAxkmGWQ/viewform", "L#4@"],
//   ["https://docs.google.com/forms/d/e/1FAIpQLSfKUBx-icfRCWmhHqUwzX60BVQE21s_NERNfU2VvbjEfE371A/viewform", "L#5@"],
//   ["https://docs.google.com/forms/d/e/1FAIpQLSfResxEUiRCyFITWPkzoQ2HhHEvUS5fyg68Rl28hFH6vhHlaA/viewform", "L#6@"],
// ]

const reDPDLinks = [
  /* always keep for splitter */
  ["https://docs.google.com/forms/d/e/1FAIpQLSf9boBe7k5tCwq7LdWgBHHGIPVc4ROO5yjVDo1X5LDAxkmGWQ/viewform", "L#0@"],

  ["https://docs.google.com/forms/d/e/1FAIpQLSdAL2PzavyrtXgGmtNrZAMyh3hV6g3fU0chxhWFxunQEZtH0g/viewform", "L#1@"],
  ["https://docs.google.com/forms/d/e/1FAIpQLSf9boBe7k5tCwq7LdWgBHHGIPVc4ROO5yjVDo1X5LDAxkmGWQ/viewform", "L#2@"],
  ["https://docs.google.com/forms/d/e/1FAIpQLSfKUBx-icfRCWmhHqUwzX60BVQE21s_NERNfU2VvbjEfE371A/viewform", "L#3@"],
  ["https://docs.google.com/forms/d/e/1FAIpQLSfResxEUiRCyFITWPkzoQ2HhHEvUS5fyg68Rl28hFH6vhHlaA/viewform", "L#4@"],
]

let isAbhidhan = localStorage.getItem("tipitakapali_org_isAbhidhan") || "yes"
var currentScript2char = currentScript2char ? currentScript2char : localStorage.getItem(STORAGE_SCRIPT_KEY) || "ro"

var TPTK_BOOK_KEY = localStorage.getItem("tipitakapali_org_CURRENT_BOOK_KEY")

if (TPTK_BOOK_KEY) {
  buttonGoHome = `<a class="noHover" style="text-decoration: none;" href="../${TPTK_BOOK_KEY}"><button id="goHomeFloating"> \ud83c\udfe0 Tipitakapali Home</button></a><span>  </span><button style="color:red;" id="hideTOCFloating" onclick="onlyHideToc()"> \ud83d\udcdc Hide TOC</button>`
} else {
  buttonGoHome = `<a class="noHover" style="text-decoration: none;" href="../index.html"><button id="goHomeFloating"> \ud83c\udfe0 Tipitakapali Home</button></a><span> </span><button style="color:red;" id="hideTOCFloating" onclick="onlyHideToc()"> \ud83d\udcdc Hide TOC</button>`
}

let notFoundHead = `<div class="notFoundHead">\ud83d\ude0c Not found, try ${ABDtitle}/${sanskritStr}</div>`

let aiLanguage = localStorage.getItem("tipitakapali_org_aiLanguage") || "English"

if (aiButton) {
  aiButton = `<a href="javascript:void(0);" onclick="translatorAI()" class="aiButton">\uD83E\uDD16 AI</a>`
  aiButtonMM = `<div id="abhidhanTranslatorAIButton" style="text-align:left; margin-left: 5px;"><a href="javascript:void(0);" onclick="abhidhanTranslatorAI()" class="aiButton">🤖 Translate အဘိဓာန်</a></div>`
} else {
  aiButton = ""
  aiButtonMM = ""
}

if (isAbhidhan == "yes") {
  abd_SansEle = `<div class="pwordInputAbhidhan"><a href="javascript:void(0);" onclick="fetchMmAbhidhan()" class="tmmAbhidhanButton">${ABDtitle}</a>  <a href="javascript:void(0);" onclick="fetchPTSPED()" class="ptsButton">${PTStitle}</a> <a href="javascript:void(0);" onclick="fetchWMSanskrit(false)" class="sanskritButton">${sanskritStr}</a> ${aiButton}</div><div id="abhidhanHere"></div><div id="ptsHere"></div><div id="sanskritHere"></div>`
} else {
  abd_SansEle = `<div class="pwordInputAbhidhan"><a href="javascript:void(0);" onclick="fetchPTSPED()" class="ptsButton">${PTStitle}</a>  <a href="javascript:void(0);" onclick="fetchWMSanskrit(false)" class="sanskritButton">${sanskritStr}</a> ${aiButton}</div><div id="abhidhanHere"></div><div id="ptsHere"></div><div id="sanskritHere"></div>`
}

let spanDpdSplitter = `${abd_SansEle}<span id="dpdSplitterEle" class="dpdSplitterClass"></span>`

const notFoundStr = notFoundHead + spanDpdSplitter + "<br>"

const aiTranslatingString = `<div style="text-align: center; padding: 10px;">
    <div style="margin: 15px 0 10px;">
        <span style="font-size: 1.5em; margin-right: 5px;">🤖</span>
        <span style="font-size: 1.2em; font-weight: bold;">AI Assistant</span>
    </div>
    <p style="line-height: 1.5; font-size: small;">
        <em>AI translations and grammar analysis <strong>may contain inaccuracies</strong>.  
        Please use them as a reference only.<br>For safety reasons, you should <b>not</b> use this AI feature if you are under the age of 18.</em>
    </p>
    <hr style="background: linear-gradient(to right, transparent, rgb(234, 110, 22), transparent);" />
    <p>
        Analysing the entire Pāḷi paragraph in the background...  
        This may take up to x minutes.
        <hr style="background: linear-gradient(to right, transparent, rgb(234, 110, 22), transparent);" />

        <em>Oh, Paṇḍita, you may close this and continue reading.</em>
    </p>
</div>`

if (!String.prototype.replaceAll) {
  /* simple string.replaceAll polyfill */
  /* only replace str, does not handle RegExp */
  /* @pnry */
  console.log("Native str.replaceAll is not available. Using superficial replaceAll.")
  String.prototype.replaceAll = function (findX, repX) {
    return this.split(findX).join(repX)
  }
}

async function tpoFetch(handlerName, postObj) {
  if (!isRunningOnMobileApp) {
    return await fetch(handlerName, postObj)
  }

  //// mobile flutter app
  if (window.flutter_inappwebview) {
    try {
      let data = JSON.parse(postObj.body)
      const result = await window.flutter_inappwebview.callHandler(handlerName, data.w, data.d)
      return {
        //// mimic the fetch API so the old code for web can be unchanged
        text: async () => result,
        json: async () => JSON.parse(result),
      }
    } catch (error) {
      console.error("Handler call error: ", error)
      return {
        text: async () => "",
        json: async () => null,
      }
    }
  } else {
    return await fetch(handlerName, postObj)
  }
}

//-----------AI translator starts ------------

async function getParentPElement(event) {
  let clickedE = event.target.closest("p")
  while (clickedE) {
    let idAttr = clickedE.getAttribute("id")
    if (idAttr && /^k\d+$/.test(idAttr)) {
      return clickedE
    }
    clickedE = clickedE.parentElement.closest("p")
  }
  return null
}

function elementToMarkdown(element) {
  let mdText = element.innerHTML
  mdText = mdText
    .replace(/<span.*?>(.*?)<\/span>/g, "$1")
    .replace(/<b(?:\s+[^>]*)?>(.*?)<\/b>/g, "**$1**") // Modified to handle b with attributes
    .replace(/<i>(.*?)<\/i>/g, "*$1*")
    .replace(/<u>(.*?)<\/u>/g, "__$1__")
    .replace(/<br\s*\/?>/g, "  \n")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/¶/g, " ")
    .replace(/\s+/g, " ")
  return mdText.trim()
}

// Function to update language selection
function updateAISelectLanguage(selectedLang) {
  aiLanguage = selectedLang
  localStorage.setItem("tipitakapali_org_aiLanguage", selectedLang)
  if (selectedLang !== "English") {
    alert("Saved!\nFrom now on, I will display bilingual \nEnglish & " + selectedLang + "\nThank you!")
  } else {
    alert("Saved!\nFrom now on, I will display only English\nThank you!")
  }
}

function createLangSelect() {
  const languages = [
    { value: "English", label: "None (Default: 🇬🇧 English)" },
    { value: "Burmese", label: "🇲🇲 Myanmar (မြန်မာ)" },
    { value: "Sinhala", label: "🇱🇰 Sinhala (සිංහල)" },
    { value: "Thai", label: "🇹🇭 Thai (ไทย)" },
    { value: "Vietnamese", label: "🇻🇳 Vietnamese (Tiếng Việt)" },

    { value: "Afrikaans", label: "Afrikaans (Afrikaans)" },
    { value: "Albanian", label: "Albanian (Shqip)" },
    { value: "Amharic", label: "Amharic (አማርኛ)" },
    { value: "Arabic", label: "Arabic (العربية)" },
    { value: "Armenian", label: "Armenian (Հայերեն)" },
    { value: "Azerbaijani", label: "Azerbaijani (Azərbaycan dili)" },
    { value: "Basque", label: "Basque (Euskara)" },
    { value: "Belarusian", label: "Belarusian (Беларуская)" },
    { value: "Bengali", label: "Bengali (বাংলা)" },
    { value: "Bosnian", label: "Bosnian (bosanski)" },
    { value: "Bulgarian", label: "Bulgarian (български)" },
    { value: "Catalan", label: "Catalan (català)" },
    { value: "Cebuano", label: "Cebuano (Binisaya)" },
    { value: "Chichewa", label: "Chichewa (Nyanja)" },
    { value: "Chinese (Simplified)", label: "Chinese (Simplified) (中文 (简体))" },
    { value: "Chinese (Traditional)", label: "Chinese (Traditional) (中文 (繁體))" },
    { value: "Corsican", label: "Corsican (Corsu)" },
    { value: "Croatian", label: "Croatian (hrvatski)" },
    { value: "Czech", label: "Czech (Čeština)" },
    { value: "Danish", label: "Danish (Dansk)" },
    { value: "Dutch", label: "Dutch (Nederlands)" },
    { value: "Esperanto", label: "Esperanto (Esperanto)" },
    { value: "Estonian", label: "Estonian (Eesti)" },
    { value: "Filipino", label: "Filipino (Tagalog)" },
    { value: "Finnish", label: "Finnish (Suomi)" },
    { value: "French", label: "French (Français)" },
    { value: "Frisian", label: "Frisian (Frysk)" },
    { value: "Galician", label: "Galician (Galego)" },
    { value: "Georgian", label: "Georgian (ქართული)" },
    { value: "German", label: "German (Deutsch)" },
    { value: "Greek", label: "Greek (Ελληνικά)" },
    { value: "Gujarati", label: "Gujarati (ગુજરાતી)" },
    { value: "Haitian Creole", label: "Haitian Creole (Kreyòl ayisyen)" },
    { value: "Hausa", label: "Hausa (Harshen Hausa)" },
    { value: "Hawaiian", label: "Hawaiian ('Ōlelo Hawaiʻi)" },
    { value: "Hebrew", label: "Hebrew (עברית)" },
    { value: "Hindi", label: "Hindi (हिन्दी)" },
    { value: "Hmong", label: "Hmong (Hmoob)" },
    { value: "Hungarian", label: "Hungarian (Magyar)" },
    { value: "Icelandic", label: "Icelandic (Íslenska)" },
    { value: "Igbo", label: "Igbo (Asụsụ Igbo)" },
    { value: "Indonesian", label: "Indonesian (Bahasa Indonesia)" },
    { value: "Irish", label: "Irish (Gaeilge)" },
    { value: "Italian", label: "Italian (Italiano)" },
    { value: "Japanese", label: "Japanese (日本語)" },
    { value: "Javanese", label: "Javanese (Basa Jawa)" },
    { value: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
    { value: "Kazakh", label: "Kazakh (Қазақ тілі)" },
    { value: "Khmer", label: "Khmer (ខ្មែរ)" },
    { value: "Kinyarwanda", label: "Kinyarwanda (Ikinyarwanda)" },
    { value: "Korean", label: "Korean (한국어)" },
    { value: "Kurdish (Kurmanji)", label: "Kurdish (Kurmanji) (Kurdî)" },
    { value: "Kurdish (Sorani)", label: "Kurdish (Sorani) (سۆرانی)" },
    { value: "Kyrgyz", label: "Kyrgyz (Кыргызча)" },
    { value: "Lao", label: "Lao (ລາວ)" },
    { value: "Latin", label: "Latin (Latina)" },
    { value: "Latvian", label: "Latvian (Latviešu)" },
    { value: "Lithuanian", label: "Lithuanian (Lietuvių)" },
    { value: "Luxembourgish", label: "Luxembourgish (Lëtzebuergesch)" },
    { value: "Macedonian", label: "Macedonian (Македонски)" },
    { value: "Malagasy", label: "Malagasy (Malagasy)" },
    { value: "Malay", label: "Malay (Bahasa Melayu)" },
    { value: "Malayalam", label: "Malayalam (മലയാളം)" },
    { value: "Maltese", label: "Maltese (Malti)" },
    { value: "Maori", label: "Maori (Māori)" },
    { value: "Marathi", label: "Marathi (मराठी)" },
    { value: "Mongolian", label: "Mongolian (Монгол)" },
    { value: "Nepali", label: "Nepali (नेपाली)" },
    { value: "Norwegian", label: "Norwegian (Norsk)" },
    { value: "Odia (Oriya)", label: "Odia (Oriya) (ଓଡ଼ିଆ)" },
    { value: "Pashto", label: "Pashto (پښتو)" },
    { value: "Persian", label: "Persian (فارسی)" },
    { value: "Polish", label: "Polish (Polski)" },
    { value: "Portuguese", label: "Portuguese (Português)" },
    { value: "Punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" },
    { value: "Romanian", label: "Romanian (Română)" },
    { value: "Russian", label: "Russian (Русский)" },
    { value: "Samoan", label: "Samoan (Gagana fa'a Samoa)" },
    { value: "Scots Gaelic", label: "Scots Gaelic (Gàidhlig)" },
    { value: "Serbian", label: "Serbian (српски)" },
    { value: "Sesotho", label: "Sesotho (Sesotho)" },
    { value: "Shona", label: "Shona (chiShona)" },
    { value: "Sindhi", label: "Sindhi (سنڌي)" },
    { value: "Slovak", label: "Slovak (slovenčina)" },
    { value: "Slovenian", label: "Slovenian (Slovenščina)" },
    { value: "Somali", label: "Somali (Soomaali)" },
    { value: "Spanish", label: "Spanish (Español)" },
    { value: "Sundanese", label: "Sundanese (Basa Sunda)" },
    { value: "Swahili", label: "Swahili (Kiswahili)" },
    { value: "Swedish", label: "Swedish (Svenska)" },
    { value: "Tajik", label: "Tajik (Тоҷикӣ)" },
    { value: "Tamil", label: "Tamil (தமிழ்)" },
    { value: "Tatar", label: "Tatar (Татар)" },
    { value: "Telugu", label: "Telugu (తెలుగు)" },
    { value: "Turkish", label: "Turkish (Türkçe)" },
    { value: "Turkmen", label: "Turkmen (Türkmen)" },
    { value: "Ukrainian", label: "Ukrainian (Українська)" },
    { value: "Urdu", label: "Urdu (اردو)" },
    { value: "Uyghur", label: "Uyghur (ئۇيغۇرچە)" },
    { value: "Uzbek", label: "Uzbek (O‘zbek)" },
    { value: "Welsh", label: "Welsh (Cymraeg)" },
    { value: "Xhosa", label: "Xhosa (isiXhosa)" },
    { value: "Yiddish", label: "Yiddish (ייִדיש)" },
    { value: "Yoruba", label: "Yoruba (Yorùbá)" },
    { value: "Zulu", label: "Zulu (isiZulu)" },
  ]

  const select = `<select class="aiLang" id="aiLang" name="aiLang" onchange="updateAISelectLanguage(this.value)">${languages
    .map(
      (lang) => `<option class="aiLang" value="${lang.value}" 
    ${lang.value === aiLanguage ? "selected" : ""}>
    ${lang.label}</option>`
    )
    .join("")}</select>`

  return select
}

async function postAI(clickedE, md) {
  isPendingAITasks = true

  const idAttr = clickedE.getAttribute("id")
  let requestSource = window.location.href || "Unknown url"
  requestSource = requestSource + "#" + idAttr

  const languageOptions = createLangSelect()

  try {
    const response = await fetch(
      aiAPIURL,
      // avoir preflight issue
      preparePostOp({
        text: md,
        from: "Pali",
        to: aiLanguage,
        url: requestSource,
      })
    )

    let html = await response.text()
    const translatedP = document.createElement("p")
    translatedP.className = clickedE.className + " aiTranslation"

    const langChoices = `
    <div class="aiLang" style="text-align: left;">
        <label>Select a secondary language for \uD83E\uDD16 AI:</label> 
        ${languageOptions}
    </div>
`

    // for tpo blue bold - without class for bold, copy into Word will lost bold
    html = html.replaceAll("<b>", "<b class='bld'>").replaceAll("<strong>", "<strong class='bld'>")

    translatedP.innerHTML = "<br>" + langChoices + "<hr>" + html + "<br>"

    translatedP.setAttribute("id", idAttr + "-translation")
    clickedE.insertAdjacentElement("afterend", translatedP)

    document.getElementById("dictionary-res").style.display = "none"

    await new Promise((resolve) => setTimeout(resolve, 100))
    translatedP.scrollIntoView({ behavior: "smooth", block: "start" })

    isPendingAITasks = false
  } catch (error) {
    console.error("Translation error:", error)
  }
}

async function translatorAI() {
  if (isPendingAITasks) {
    alert("Oh, Paṇḍita, please wait... for the previous translation request to complete!")
    return
  }

  let notAvailableSms = "AI Assistant works only if you click a word in a Tipitakapali.org paragraph, then click the AI button."

  if (!currentPEleForAI) {
    alert(notAvailableSms)
    return
  }

  try {
    const clickedPEle = await getParentPElement(currentPEleForAI)
    if (!clickedPEle) {
      alert(notAvailableSms)
      return
    }

    const idAttr = clickedPEle.getAttribute("id")
    if (!idAttr) {
      alert(notAvailableSms)
      return
    }

    const translationId = idAttr + "-translation"
    const translatedP = document.getElementById(translationId)
    const dictRes = document.getElementById("dictionary-res")

    if (translatedP) {
      dictRes.style.display = "none"
      translatedP.scrollIntoView({ behavior: "auto", block: "start" })
      return
    }

    nowDict = true
    dpdLastClickEle = false
    isAbhidhanFetched = false
    isPTSFetched = false
    isSanskritFetched = false

    dictRes.innerHTML = aiTranslatingString
    dictRes.style.display = "block"

    const md = elementToMarkdown(clickedPEle)

    if (md.length > 0) {
      await postAI(clickedPEle, md)
    }
  } catch (error) {
    console.error("Translation process error:", error)
    // Show error in dictionary-res
    const dictRes = document.getElementById("dictionary-res")
    dictRes.innerHTML = "Translation failed. Please try again."
    setTimeout(() => {
      dictRes.style.display = "none"
    }, 3000)
  }
}

async function abhidhanTranslatorAI() {
  const clickedPEle = document.getElementById("tmmAbhidhan")
  if (!clickedPEle) {
    return
  }

  let htmlAbhidhan = clickedPEle.innerHTML
  htmlAbhidhan = htmlAbhidhan.replaceAll(aiButtonMM, "")

  // console.log(htmlAbhidhan)
  let aiMMButton = document.getElementById("abhidhanTranslatorAIButton")
  aiMMButton.innerHTML = "<em>For safety reasons, you should <b>not</b> use this AI feature if you are under the age of 18.<br>Translating...</em>"

  try {
    const response = await fetch(
      aiAPIURL,
      // avoir preflight issue
      preparePostOp({
        text: htmlAbhidhan,
        from: "Myanmar",
        to: aiLanguage,
        url: "Abhidhan",
      })
    )

    let aiHTMLResponse = await response.text()

    const translatedP = document.createElement("p")
    translatedP.className = clickedPEle.className + " aiTranslation"

    // for tpo blue bold - without class for bold, copy into Word will lost bold
    aiHTMLResponse = aiHTMLResponse.replaceAll("<b>", "<b class='bld'>").replaceAll("<strong>", "<strong class='bld'>")

    translatedP.innerHTML = "<br>" + aiHTMLResponse + "<br>"

    translatedP.setAttribute("id", "tmmAbhidhan" + "-translation")
    // type InsertPosition = "afterbegin" | "afterend" | "beforebegin" | "beforeend";
    clickedPEle.insertAdjacentElement("beforeend", translatedP)
    aiMMButton.innerHTML = ""
    // aiMMButton.replaceWith(translatedP)

    await new Promise((resolve) => setTimeout(resolve, 100))
    translatedP.scrollIntoView({ behavior: "smooth", block: "start" })
  } catch (error) {
    console.error("Translation error:", error)
  }
}

//-----------AI translator ends ------------

function restoreMinifiedLinks(html, restoreHelp = true) {
  if (restoreHelp) {
    html = restoreDPDFeedbackStr(html)
  }
  reDPDLinks.forEach(([link, code]) => {
    html = html.replaceAll(code, link)
  })
  return html.trim()
}

function restoreDPDFeedbackStr(html) {
  let feedbackMatchIds = []
  let m
  while ((m = regExpFeedbackDPDId.exec(html)) !== null) {
    feedbackMatchIds.push([m[0], m[1]])
  }

  if (feedbackMatchIds.length < 1) {
    // console.log("No feedback ID in html")
    return html
  }

  feedbackMatchIds.forEach((e) => {
    const [entireMatchStr, idAndLemma] = e
    const [id, lemma] = idAndLemma.split("=")
    let st = dpd_feedback_s.replaceAll("#tpo_id@", id)
    st = st.replaceAll("#tpo_word@", lemma)
    st = st.replaceAll("#tpo_link@", lemma.replaceAll(" ", "%20"))
    html = html.replace(entireMatchStr, st)
  })

  return html
}

function changeFontSize(amount) {
  currentFontSizeMultiplier = (parseFloat(currentFontSizeMultiplier) + amount).toFixed(1);
  if (currentFontSizeMultiplier < 0.2) {
    currentFontSizeMultiplier = 0.2;
  }
  document.documentElement.style.setProperty("--font-size-multiplier", currentFontSizeMultiplier);
  localStorage.setItem(FONT_SIZE_MULTIPLIER_KEY, currentFontSizeMultiplier);
  
  const fontSizeDisplay = document.getElementById("fontSizeDisplay");
  if(fontSizeDisplay) {
    fontSizeDisplay.innerText = currentFontSizeMultiplier + "x";
  }
}

function showHideToc() {
  var defiEl = document.getElementById("dictionary-res")
  if (nowDict) {
    defiEl.innerHTML = ""
    defiEl.style.display = "none"
    nowDict = false
  }
  var button = document.getElementById("floatingTocButton")
  var tocbox = document.getElementById("tocDivBox")

  if (nowToc) {
    nowToc = false
    tocbox.style.display = "none"

    /* button.textContent = " = "; does not work inside VRI (old ES?) */
    button.innerText = " \ud83d\udcdc "
    button.style.background = ""
    button.style.color = "red"

    defiEl.innerHTML = ""
    defiEl.style.display = "none"
    nowDict = false
  } else {
    nowToc = true
    tocbox.style.display = ""

    const fontSizeControl = `
      <div id="fontSizeControl" style="display: flex; align-items: center; margin-top: 10px;">
        <span id="fontSizeDisplayTextSize" style="font-style: normal; color: blue; padding-right: 5px; font-size: small;">Text size</span>
        <button id="decreaseFontSize" style="font-size: 16px; padding: 5px 10px;">-</button>
        <span id="fontSizeDisplay" style="font-size: medium; margin: 0 10px;">${currentFontSizeMultiplier}x</span>
        <button id="increaseFontSize" style="font-size: 16px; padding: 5px 10px;">+</button>
      </div>
    `;

    button.innerHTML = prepareMATNButtons() + fontSizeControl + buttonGoHome;
    button.style.background = "#ccc";
    button.style.color = "brown";

    document.getElementById("decreaseFontSize").addEventListener("click", () => changeFontSize(-0.1));
    document.getElementById("increaseFontSize").addEventListener("click", () => changeFontSize(0.1));
  }
}

function onlyHideToc() {
  var button = document.getElementById("floatingTocButton")
  var tocbox = document.getElementById("tocDivBox")
  nowToc = false
  /* otherwise it will also popup dict for a word nearby */
  stopWordClick = true

  tocbox.style.display = "none"

  button.innerText = " \ud83d\udcdc "
  button.style.background = ""
  button.style.color = "red"
}

function handleGoToC() {
  if (!location.pathname) return

  const ele = document.getElementById("inputParaNo")
  const rangeData = ele.getAttribute("para-range")
  const [startPara, endPara] = rangeData.split("-").map(Number)

  const uEnter = Number(ele.value.trim())
  if (isNaN(uEnter)) {
    ele.value = ""
    alert(`Enter a number in this range: ${rangeData}`)
    ele.focus()
    return
  }

  if (uEnter >= startPara && uEnter <= endPara) {
    location.replace(`${location.pathname}#para${uEnter}`)
    ele.value = ""
    onlyHideToc()
  } else {
    ele.value = ""
    alert(`Enter a number in this range: ${rangeData}`)
    ele.focus()
  }
}

function enterKeyGoToc(e) {
  if (e.isComposing || e.keyCode === 229) {
    return
  }
  if (e.key === "Enter" || e.keyCode === 13) {
    handleGoToC()
  }
}

function handleGoPage(inputId) {
  const temp = inputId.split("_")
  const vol = temp[temp.length - 1]

  const ele = document.getElementById(inputId)
  const rangeData = ele.getAttribute("page-range")
  const [startPage, endPage] = rangeData.split("-").map(Number)

  const uEnter = Number(ele.value.trim())
  if (isNaN(uEnter)) {
    ele.value = ""
    alert(`Enter a number in this range: ${rangeData}`)
    ele.focus()
    return
  }

  if (uEnter >= startPage && uEnter <= endPage) {
    location.replace(`${location.pathname}#${vol}.${uEnter}`)
    ele.value = ""
    onlyHideToc()
  } else {
    ele.value = ""
    alert(`Enter a number in this range: ${rangeData}`)
    ele.focus()
  }
}

function enterKeyGoPage(e, inputId) {
  if (e.isComposing || e.keyCode === 229) {
    return
  }
  if (e.key === "Enter" || e.keyCode === 13) {
    handleGoPage(inputId)
  }
}

function listenId(id, event, handler) {
  const element = document.getElementById(id)
  if (element) {
    element.addEventListener(event, handler, { passive: false })
  }
}

function button_click(el) {
  //// it will be used later in the browser, do not delete

  /** pnry modified
   * auto close the previous clicked div (button content)
   * so no need to scroll
   * remember rename the original button_click function to button_click_o
   */

  //   if (isAbhidhan == "yes") {
  // if (true) {
  let defiEl = document.getElementById("abhidhanHere")
  if (defiEl) defiEl.classList.add("hidden")
  let sanskritEl = document.getElementById("sanskritHere")
  if (sanskritEl) sanskritEl.classList.add("hidden")
  let ptsEl = document.getElementById("ptsHere")
  if (ptsEl) ptsEl.classList.add("hidden")
  // }

  const nowId = el.getAttribute("data-target")
  const nowClickEle = document.getElementById(nowId)

  if (dpdLastClickEle && dpdLastClickEle !== nowClickEle) {
    if (!dpdLastClickEle.classList.contains("hidden")) {
      dpdLastClickEle.classList.toggle("hidden")
    }
  }

  dpdLastClickEle = nowClickEle

  // Remove 'active' class from the previously clicked button
  if (dpdLastClickButtonEl && dpdLastClickButtonEl !== el) {
    dpdLastClickButtonEl.classList.remove("active")
  }

  //// do post REQUEST for inflection
  if (nowId.startsWith("declension_") || nowId.startsWith("conjugation_")) {
    setTimeout(() => {
      fetchInflection(nowId, "ro")
    }, 0)
  }
  dpd_button_click(el)
  // Store the current button as the last clicked button
  dpdLastClickButtonEl = el
}

function dpd_button_click(el) {
  /**
   * This function button_click is extracted from
   * Digital Pāḷi Dictionary
   * Creative Commons Attribution-NonCommercial 4.0 International License
   * https://github.com/digitalpalidictionary/dpd-db/releases
   **/

  const targetId = el.getAttribute("data-target")
  const target = document.getElementById(targetId)
  target.classList.toggle("hidden")
  if (el.classList.contains("close")) {
    const targetControl = document.querySelector(`a.dpd-button[data-target="${targetId}"]`)
    targetControl.classList.toggle("active")
  } else {
    el.classList.toggle("active")
  }

  //// Scroll to the parent element of the target content
  if (!targetId.startsWith("declension_") && !targetId.startsWith("conjugation_")) {
    const parentElement = target.parentElement
    if (parentElement) {
      parentElement.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }
}

function playAudio(headword, buttonElement) {
  /**
   * This function playAudio is extracted from
   * Digital Pāḷi Dictionary
   * Creative Commons Attribution-NonCommercial 4.0 International License
   * https://github.com/digitalpalidictionary/dpd-db/releases
   **/

  // const validGenders = ["male", "female", "male1", "male2", "female1"];
  // if (!validGenders.includes(gender)) {
  //   gender = "male";
  // }

  const gender = "male"
  const baseUrl = "https://www.dpdict.net/audio/"
  var audio = new Audio(baseUrl + headword + "?gender=" + gender)

  audio.addEventListener("error", function () {
    if (buttonElement) {
      // Change icon to cross
      buttonElement.innerHTML = `
                <svg viewBox="0 0 24 24" width="16px" height="16px" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            `
      // Disable button
      buttonElement.classList.add("disabled")
      buttonElement.style.pointerEvents = "none"
      buttonElement.title = "Audio not found"
      buttonElement.removeAttribute("onclick")
    }
  })

  audio.play().catch(function (error) {
    console.log("Audio play failed: ", error)
  })
}


// function closeByHeadWord() {
//   var defiEl = document.getElementById("dictionary-res")

//   defiEl.innerHTML = ""
//   defiEl.style.display = "none"
//   /* true to prevent under word popups */
//   nowDict = true
// }

function highlightWordClick(word, eTargetNow) {
  if (hlLastClickEle) {
    hlLastClickEle.innerHTML = hlLastClickEle.innerHTML.replace(/<\/?z>/g, "")
  }

  hlLastClickEle = eTargetNow
  //// Escape special characters in the word
  // const espWord = word.replaceAll("?", "\\?");
  const espWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const rex = new RegExp(`(\\s|^)(${espWord})(\\s|$)`, "g")

  let cHTML = eTargetNow.innerHTML
  eTargetNow.innerHTML = cHTML.replace(rex, (_, s1, wo, s2) => {
    return `${s1}<z>${wo}</z>${s2}`
  })
}

function handleClickEvent(e) {
  /** Generated with PNRY + Generative AIs */

  //// Page info
  if (e.target.classList.contains("pinfo")) {
    return alert(e.target.title)
  }

  if (e.target.classList.contains("aiLang")) {
    return
  }

  //// For DPD's buttons
  if (e.target.classList.contains("root_button") || e.target.classList.contains("dpd-button")) {
    e.preventDefault()
    return button_click(e.target)
  }

  //// --- 1. Text Selection Detection (Improved) ---
  if (
    window.getSelection().toString() !== "" || // Check for active selection
    e.detail > 1 ||
    (e.touches && e.touches.length > 1)
  ) {
    return //// Exit if selection is active or multi-touch/click
  }

  if (e.target.id == "floatingTocButton") {
    /* TOC button */
    showHideToc()
    return
  }

  if (stopWordClick) {
    stopWordClick = false
    return
  }

  var defiEl = document.getElementById("dictionary-res")
  var tocDivBox = document.getElementById("tocDivBox")

  /* Disable word-click on these items */
  let isInputForm = e.target.tagName == "INPUT"
  let isATag = e.target.tagName == "A"

  let isInsideDefi = defiEl.contains(e.target)

  /* Handle word click inside DPD */
  let isInsideDPD = false
  let dpdResEle = document.querySelector("#dictionary-res > section")

  if (dpdResEle) {
    isInsideDPD = dpdResEle.contains(e.target)
  }

  if (!isInputForm && !isATag && !tocDivBox.contains(e.target)) {
    if (nowDict && !isInsideDefi) {
      /** Close the popup if it is currently opening */
      defiEl.innerHTML = ""
      defiEl.style.display = "none"
      nowDict = false
      /* reset dpdLastClickEle */
      dpdLastClickEle = false
      isAbhidhanFetched = false
      isPTSFetched = false
      isSanskritFetched = false

      return
    }

    if (nowToc) {
      return
    }

    isAbhidhanFetched = false
    isPTSFetched = false
    isSanskritFetched = false

    /** word click */
    var node, offset
    if (document.caretRangeFromPoint) {
      var range = document.caretRangeFromPoint(e.clientX, e.clientY)
      node = range.startContainer
      offset = range.startOffset
    } else if (document.caretPositionFromPoint) {
      var caretPos = document.caretPositionFromPoint(e.clientX, e.clientY)
      node = caretPos.offsetNode
      offset = caretPos.offset
    }
    var textNodeContent = node.textContent
    var start = offset
    var end = offset
    while (start > 0 && /\S/.test(textNodeContent[start - 1])) {
      start--
    }
    while (end < textNodeContent.length && /\S/.test(textNodeContent[end])) {
      end++
    }
    var word = textNodeContent.slice(start, end)
    const originWord = word

    if (word) {
      word = word.toLowerCase()

      /* Strip all punctuations & numbers from word */
      /* case like word-word => word word */
      /* word = word.replace(stripRex, ""); */

      // word = word.replace(spaceThemRex, " ")
      word = word.replace(regExpSpacePunctuations, " ")
      word = word.trim()

      if (!word) {
        return
      }

      if (!isInsideDefi) {
        currentPEleForAI = e
      } else {
        currentPEleForAI = null
      }

      fetchDictDefi(word)

      if (!isInsideDefi) {
        //// when user is reading the defi, we highlight the word
        setTimeout(() => {
          highlightWordClick(originWord, e.target)
        }, 0)
      }

      // if (Android) {
      //   let htmlres = Android.getDictDefinition(word);

      //   if (htmlres) {
      //     defiEl.innerHTML = `<input oninput="uTyping()" class="pwordInput" placeholder="Velthuis typing scheme" id="cinput"  onchange="inputChangeLookup()" type="text" value="${word}" /><br>${htmlres}`;

      //     defiEl.style.display = "block";
      //     nowDict = true;
      //   } else {
      //     let spliterRes = Android.getDpdSplitter(word);

      //     let htmlres = `<input oninput="uTyping()" class="pwordInput" placeholder="Velthuis typing scheme"  id="cinput" onchange="inputChangeLookup()" type="text" value="${word}" /><br>${notFoundHead}`;
      //     if (spliterRes) {
      //       htmlres += `<span id="dpdSplitterEle" class="dpdSplitterClass">${spliterRes}</span>`;
      //     }

      //     htmlres += notFoundEnd;

      //     defiEl.innerHTML = htmlres;

      //     defiEl.style.display = "block";
      //     nowDict = true;
      //   }
      // } else {
      // fetchDictDefi(word);
      // }
    }
  }
}

function preparePostOp(postObj) {
  //// This will trigger preflight for online fetch, offline OK

  return {
    method: "POST",
    headers: {
      //// use this to avoid preflight
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(postObj).toString(),
  }
}

async function fetchDictDefi(word, useSplitter = "no") {
  var defiEl = document.getElementById("dictionary-res")

  //// converting
  topInputDisplayWord = word

  if (currentScript2char !== "ro") {
    word = fromMixThisPaliScr(word, "ro")
  } else {
    /// allow multi script
    if (nonRomanPaliCharsRex.test(word)) {
      word = fromMixThisPaliScr(word, "ro")
    }
  }

  word = word.replace(regExpSpacePunctuations, " ").trim()

  currentPObj = { w: word, d: useSplitter }

  isAbhidhanFetched = false
  isPTSFetched = false
  isSanskritFetched = false

  try {
    const response = await tpoFetch(dpdAPIURL, preparePostOp(currentPObj))
    const htmlres = await response.text()
    if (htmlres) {
      const restore_links_html = restoreMinifiedLinks(htmlres, true)
      const finalHtml = abd_SansEle + restore_links_html

      defiEl.innerHTML = `<input oninput="uTyping()" class="pwordInput ${currentScript2char}" placeholder="Velthuis typing scheme" id="cinput" onchange="inputChangeLookup()" type="text" value="${topInputDisplayWord}" />${finalHtml}`

      // summaryDPD(defiEl)

      defiEl.style.display = "block"
      nowDict = true

      //// Converting pali table into current script
      //// setTimeout will help non-locking
      if (currentScript2char !== "ro") {
        setTimeout(() => {
          convertMainDpdContentScript(defiEl)
        }, 0)

        //// converting spliter
        //// span class=p2w is the hzeading word
        const decons = defiEl.querySelectorAll(".dp9 p.dec, .dp9 span.p2w")
        if (decons) {
          decons.forEach((element) => {
            convertPaliInElement_FromRo(element, true)
          })
        }
      }
    } else {
      defiEl.innerHTML = `<input oninput="uTyping()" class="pwordInput ${currentScript2char}" placeholder="Velthuis typing scheme" id="cinput" onchange="inputChangeLookup()" type="text" value="${topInputDisplayWord}" />${notFoundStr}`
      defiEl.style.display = "block"
      nowDict = true

      //// if main dpd + spliter does not have, try the Sanskrit
      //// await fetchSplitterDefi(word, "yes")
      currentPObj = { w: word, d: "yes" }
      await fetchWMSanskrit(true)
    }
  } catch (er) {
    defiEl.innerHTML = `<input oninput="uTyping()" class="pwordInput ${currentScript2char}" placeholder="Velthuis available" id="cinput" onchange="inputChangeLookup()" type="text" value="${topInputDisplayWord}" />${er}`
    defiEl.style.display = "block"
    nowDict = true
  }
}

async function convertMainDpdContentScript(defiEl) {
  //// Class dp9 is for main dpd, and also for deconstructor
  const sections = defiEl.querySelectorAll("section.dp9")
  sections.forEach((section) => {
    if (section.querySelector("b.epd")) {
      //// epd english pali dictionary
      const headingWords = section.querySelectorAll("b.epd")
      headingWords.forEach((element) => {
        convertPaliInElement_FromRo(element)
      })
    } else {
      const headingWords = section.querySelectorAll("span.p1w, span.p2w")
      headingWords.forEach((element) => {
        convertPaliInElement_FromRo(element)
      })
    }
  })
  //// Class pali text in example, worse in MM
  // const classPT = defiEl.querySelectorAll(".pt")
  // classPT.forEach((element) => {
  //   convertPaliInElement_FromRo(element)
  // })

  //// Do converting pali root family, compound family for all
  convertPaliTableCells(defiEl, "table.family, table.root_family", "th", false)
}

// async function fetchSplitterDefi(word, useSplitter = "yes") {
//   currentPObj = { w: word, d: useSplitter }
//   let deconsEle = document.getElementById("dpdSplitterEle")

//   try {
//     const response = await tpoFetch(dpdAPIURL, preparePostOp(currentPObj))
//     const htmlres = await response.text()

//     if (htmlres) {
//       // const processedHtml = restoreMinifiedLinks(htmlres)

//       // deconsEle.innerHTML = "<hr><div>\ud83d\udda5 DPD Computed Splitter<div>" + processedHtml
//       deconsEle.innerHTML = htmlres

//       //// converting
//       if (currentScript2char !== "ro") {
//         //// span class=p2w is the heading word
//         const decons = deconsEle.querySelectorAll(".dp9 p.deconstructor, .dp9 span.p2w")
//         decons.forEach((element) => {
//           convertPaliInElement_FromRo(element, true)
//         })
//       }
//     } else {
//       await fetchWMSanskrit(true)
//     }
//   } catch (er) {
//     console.log(er)
//     return er
//   }
// }

// eslint-disable-next-line no-unused-vars
async function fetchMmAbhidhan(isDPDSplitter = "no") {
  if (isSanskritFetched) {
    let hidMS = document.getElementById("sanskritHere")
    hidMS.classList.add("hidden")
  }

  if (isPTSFetched) {
    let hidMS = document.getElementById("ptsHere")
    hidMS.classList.add("hidden")
  }

  let defiEl = document.getElementById("abhidhanHere")
  if (isAbhidhanFetched) {
    defiEl.classList.toggle("hidden")
    return
  }

  try {
    const response = await tpoFetch(abhiDhanAPIURL, preparePostOp(currentPObj))
    const htmlres = await response.text()

    isAbhidhanFetched = true
    if (htmlres) {
      defiEl.innerHTML = `<section id="tmmAbhidhan" class="tmmAbhidhan">${aiButtonMM}${htmlres}</section>`
    } else {
      defiEl.innerHTML = `<section id="tmmAbhidhan" class="tmmAbhidhan">${notFoundHeadAbhidhan}</section>`
    }
  } catch (er) {
    console.log(er)
  }
}

async function fetchPTSPED(isDPDSplitter = "no") {
  if (isSanskritFetched) {
    let hidMS = document.getElementById("sanskritHere")
    hidMS.classList.add("hidden")
  }

  if (isAbhidhanFetched) {
    let hidMS = document.getElementById("abhidhanHere")
    hidMS.classList.add("hidden")
  }

  let defiEl = document.getElementById("ptsHere")
  if (isPTSFetched) {
    defiEl.classList.toggle("hidden")
    return
  }

  try {
    const response = await tpoFetch(ptsAPIURL, preparePostOp(currentPObj))
    const htmlres = await response.text()

    isPTSFetched = true
    if (htmlres) {
      defiEl.innerHTML = `<section id="pts15" class="pts15">${htmlres}</section>`
    } else {
      defiEl.innerHTML = `<section id="pts15" class="pts15">${notFoundHeadPTS}</section>`
    }
  } catch (er) {
    console.log(er)
  }
}

async function fetchWMSanskrit(hideNotfound = false, isDPDSplitter = "no") {
  if (isAbhidhanFetched) {
    let hidMS = document.getElementById("abhidhanHere")
    if (hidMS) hidMS.classList.add("hidden")
  }

  if (isPTSFetched) {
    let hidMS = document.getElementById("ptsHere")
    if (hidMS) hidMS.classList.add("hidden")
  }

  let defiEl = document.getElementById("sanskritHere")
  if (isSanskritFetched) {
    if (defiEl) defiEl.classList.toggle("hidden")
    return
  }

  let word = currentPObj["w"].replace("√", "").trim()

  try {
    const response = await tpoFetch(wmSanskritAPIURL, preparePostOp({ w: word, d: "no" }))
    const htmlres = await response.text()

    isSanskritFetched = true
    if (htmlres) {
      defiEl.innerHTML = `<section id="sanskritSection" class="sanskritSection">${htmlres}</section>`
    } else {
      if (hideNotfound) {
        defiEl.classList.add("hidden")
      }
      defiEl.innerHTML = `<section id="sanskritSection" class="sanskritSection">${notFoundHeadSanskrit}</section>`
    }
  } catch (er) {
    console.log(er)
  }
}


// Function to highlight matching inflections in tables
// This function is adapted from DPD (CC BY-NC-SA 4.0)
// https://github.com/digitalpalidictionary/dpd-db
function highlightInflections(searchTerm) {
  if (!searchTerm) return;

  // Normalize the incoming searchTerm to text
  const tempDiv = document.createElement("div");
  tempDiv.textContent = searchTerm;
  const normalizedSearch = tempDiv.textContent;

  // Find all inflection tables
  const inflectionTables = document.querySelectorAll("table.inflection");

  // Process each inflection table
  inflectionTables.forEach(function (table) {
    // Find all td elements (inflection cells)
    const cells = table.querySelectorAll("td");

    // Process each cell
    cells.forEach(function (cell) {
      // Get the innerHTML of the cell
      const cellHTML = cell.innerHTML;

      // Split the cell content by <br> tags to get individual inflections
      const parts = cellHTML.split(/<br\s*\/?>/i);

      let modified = false;
      const newParts = parts.map(function (part) {
        // Create a temporary element to get the text content of this part
        const tempElement = document.createElement("div");
        tempElement.innerHTML = part;
        const partText = tempElement.textContent || "";

        // Check if the normalized search term matches this part exactly
        if (partText === normalizedSearch) {
          // Create a span and set its textContent to partText
          const span = document.createElement("span");
          span.className = "inflection-highlight";
          span.textContent = partText;
          modified = true;
          return span.outerHTML;
        }
        return part;
      });

      // If we modified any parts, update the cell content
      if (modified) {
        cell.innerHTML = newParts.join("<br>");
      }
    });
  });
}


async function fetchInflection(nowId, script = "ro") {
  let thisEle = document.getElementById(nowId)

  if (thisEle.innerHTML.length > 1) {
    //// so that no need to re-fetch from the db
    return
  }

  //// temporarily hide, after converting into other script will be enabled again
  thisEle.style.display = "none"
  const idData = nowId.startsWith("declension_") ? nowId.split("declension_") : nowId.split("conjugation_")

  let wordToCheck = idData[1]
  if (wordToCheck.length < 1) {
    console.log("No word to fetch inflection in ID:", nowId)
    return
  }

  try {
    //// abhihārayi
    const response = await tpoFetch(infAPIURL, preparePostOp({ w: wordToCheck, d: "no" }))
    const htmlres = await response.text()
    if (htmlres) {
      let processedHtml = restoreMinifiedLinks(htmlres, false)
      thisEle.innerHTML = processedHtml

      let roInflectionTable = ""
      let inflectElement = thisEle.querySelector("table")
      if (inflectElement) {
        roInflectionTable = `<hr><h3 style="text-align:center;color: orange;">Inflection in Roman Pāḷi</h3><hr>` + inflectElement.outerHTML
      }

      //// pali converter task
      if (currentScript2char !== "ro") {
        convertPaliTableCells(thisEle, "table.inflection", "td", true)
        thisEle.innerHTML = thisEle.innerHTML + roInflectionTable
      }
      thisEle.style.display = ""

      if (currentPObj["w"]) {
          highlightInflections(currentPObj["w"])
      }
      //// Scroll to the parent element of the target content
      if (location.pathname) {
        const parentElement = thisEle.parentElement
        if (parentElement) {
          setTimeout(() => {
            parentElement.scrollIntoView({ behavior: "auto", block: "start" })
          }, 0)
        }
      }
    }
  } catch (er) {
    console.log(er)
  }
}

function convertPaliTableCells(thisEle, selectTable = "table.inflection", onlyCell = "td", removeBoldTag = false) {
  //// Find all tables matching the selector
  const tables = thisEle.querySelectorAll(selectTable)
  if (tables.length > 0) {
    tables.forEach((table) => {
      //// Select all td/th elements in the table
      //// For declension and conjugation only convert td
      //// For root family or compound family only convert th

      const cells = table.querySelectorAll(onlyCell)
      cells.forEach((cell) => {
        // Remove tags
        convertPaliInElement_FromRo(cell, removeBoldTag)
      })
    })
  } else {
    // console.log("No tables found in the element", thisEle)
  }
}

// async function decompressResponse(response) {
// return response.text()

//// helper function to decompress the response for old browser only,
//// modern browsers when receiving a response with a Content-Encoding header indicating gzip
//// they will un-compress it automatically

// const reader = response.body.getReader();
// const stream = new ReadableStream({
//   start(controller) {
//     return pump();
//     function pump() {
//       return reader.read().then(({ done, value }) => {
//         if (done) {
//           controller.close();
//           return;
//         }
//         controller.enqueue(value);
//         return pump();
//       });
//     }
//   },
// });
// return new Response(stream).text();
// }

// function convertPaliHTML(htmlDecl, toScript) {}

// function lsk(w, isDPDSplitter = "no") {
//   isSanskritFetched = false

//   if (isAbhidhanFetched) {
//     let hidMS = document.getElementById("abhidhanHere")
//     hidMS.classList.add("hidden")
//   }

//   let defiEl = document.getElementById("sanskritHere")

//   if (isSanskritFetched) {
//     defiEl.classList.toggle("hidden")
//     return
//   }

//   /* for sanskrit, need to remove √ */
//   word = w.replace("√", "")
//   tpoFetch(
//     wmSanskritAPIURL,
//     preparePostOp({
//       w: word,
//       d: "no",
//     }),
//   )
//     .then((res) => res.text())
//     .then((htmlres) => {
//       isSanskritFetched = true
//       if (htmlres) {
//         defiEl.innerHTML = `<section id="sanskritSection" class="sanskritSection">${htmlres}</section>`
//       } else {
//         defiEl.innerHTML = `<section id="sanskritSection"  class="sanskritSection">${notFoundHeadSanskrit}</section>`
//       }
//     })
//     .catch((er) => {
//       console.log(er)
//     })
// }

function toggleTmmAbhidhan() {
  let el = document.getElementById("tmmAbhidhan")
  el.classList.toggle("hidden")
}

function uTyping() {
  let t = document.getElementById("cinput")
  setTimeout(function () {
    /* TODO this is a workaround */
    /* bug double āā */
    t.value = typeVelthuis(t.value)
  }, 15)
}

function inputChangeLookup() {
  let e = document.getElementById("cinput")
  let word = e.value.trim()
  if (word.includes(" ")) {
    let wordsArray = word.split(/\s+/)
    //// Check if the input exceeds 20 words
    if (wordsArray.length > 20) {
      wordsArray = wordsArray.slice(0, 20)
      e.value = wordsArray.join(" ")
      word = e.value.trim()
      alert("Allow max 20 words at a time. Offline app is unlimited.")
    }
  }
  if (word) {
    fetchDictDefi(word)
  }
}

function getFeedbackTemplateFromDb(urlVisiting = "unknown") {
  //// it will fetch the feedback template from the dpd including the date
  tpoFetch(dpdAPIURL, preparePostOp({ w: "##tipitakapalidpdfeedback", d: "no", v: urlVisiting }))
    .then((response) => response.text())
    .then((data) => {
      if (data) {
        dpd_feedback_s = data
      } else {
        dpd_feedback_s = `<p>ID <b>#tpo_id@ #tpo_word@</b></p><p>Digital Pāḷi Dictionary is a work in progress, made available for testing and feedback purposes.</p><p><a class="link" href="https://docs.google.com/forms/d/e/1FAIpQLSfResxEUiRCyFITWPkzoQ2HhHEvUS5fyg68Rl28hFH6vhHlaA/viewform?usp=pp_url&entry.1433863141=Tipitakapali.org+9999-99-99" target="_blank">Add a missing word</a><span>. Please use this </span><a class="link" href="https://docs.google.com/forms/d/e/1FAIpQLSfResxEUiRCyFITWPkzoQ2HhHEvUS5fyg68Rl28hFH6vhHlaA/viewform?usp=pp_url&entry.1433863141=Tipitakapali.org+9999-99-99" target="_blank">online form</a> to add missing words, especially from Vinaya, commentaries, and other later texts. If you prefer to work offline, here is a <a class="link" href="https://github.com/digitalpalidictionary/dpd-db/raw/main/docs/DPD%20Add%20Words.xlsx" download="true" target="_blank">spreadsheet to download</a><span>, fill in and submit. </span></p><p><a class="link" href="https://docs.google.com/forms/d/e/1FAIpQLSf9boBe7k5tCwq7LdWgBHHGIPVc4ROO5yjVDo1X5LDAxkmGWQ/viewform?usp=pp_url&entry.438735500=#tpo_link@&entry.1433863141=Tipitakapali.org+9999-99-99" target="_blank">Correct a mistake</a><span>. Did you spot a mistake in the dictionary? Please report it. It generally takes less than a minute and your corrections and suggestions help to improve the quality of this dictionary for everyone who uses it.</span></p><p><a class="link" href="https://github.com/digitalpalidictionary/digitalpalidictionary/releases">Get updated</a><span>. You are using DPD Tipitakapali.org updated on <b>9999-99-99</b>. Check for an update every full moon uposatha day.</span></p><p><a class="link" href="https://digitalpalidictionary.github.io/">Visit the website</a><span>. Get more detailed information about installation and upgrades, advanced settings and features.</span></p><p><a class="link" href="mailto:digitalpalidictionary@gmail.com?subject=I'd%20like%20to%20help%20with%20code!&body=Please%20let%20me%20know%20how%20I%20can%20get%20involved%20with%20the%20development%20of%20DPD.">Help with coding</a><span>. If you're a coder and would like to support the project, please get in touch.</span></p><p><a class="link" href="mailto:digitalpalidictionary@gmail.com?subject=I%20want%20to%20help%20with%20DPD!&body=Please%20let%20me%20know%20how%20I%20can%20get%20involved%20with%20the%20development%20of%20DPD.">Help with Pāḷi</a><span>. If you have Pāḷi grammar skills and would like to assist, please make email contact.</span></p><p><a class="link" href="mailto:digitalpalidictionary@gmail.com?subject=Keep%20me%20updated!&body=Please%20let%20me%20know%20about%20new%20features%20and%20updates%20as%20soon%20as%20they%20are%20available.">Join the mailing list</a><span>. Get notified of updates and new features as soon as they become available.</span></p>`
      }
    })
    .catch((error) => console.error("Error fetching feedback string from db:", error))
}

function typeVelthuis(uType) {
  /* 2017, updated 20 Dec 2020 */
  return uType
    .replace(/aa/g, "ā")
    .replace(/ii/g, "ī")
    .replace(/uu/g, "ū")
    .replace(/m\.\./g, "ṁ")
    .replace(/\.m/g, "ṃ")
    .replace(/\.n/g, "ṇ")
    .replace(/\.d/g, "ḍ")
    .replace(/ll\./g, "ḹ")
    .replace(/\.l/g, "ḷ")
    .replace(/\.h/g, "ḥ")
    .replace(/\.r/g, "ṛ")
    .replace(/rr\./g, "ṝ")
    .replace(/\.s/g, "ṣ")
    .replace(/"s/g, "ś")
    .replace(/s\.\./g, "ś")
    .replace(/\.t/g, "ṭ")
    .replace(/~n/g, "ñ")
    .replace(/,,n/g, "ñ")
    .replace(/"n/g, "ṅ")
    .replace(/n\.\./g, "ṅ")

    .replace(/AA/g, "Ā")
    .replace(/II/g, "Ī")
    .replace(/UU/g, "Ū")
    .replace(/M\.\./g, "Ṁ")
    .replace(/\.M/g, "Ṃ")
    .replace(/\.N/g, "Ṇ")
    .replace(/\.D/g, "Ḍ")
    .replace(/LL\./g, "Ḹ")
    .replace(/\.L/g, "Ḷ")
    .replace(/\.H/g, "Ḥ")
    .replace(/\.R/g, "Ṛ")
    .replace(/RR\./g, "Ṝ")
    .replace(/\.S/g, "Ṣ")
    .replace(/"S/g, "Ś")
    .replace(/S\.\./g, "Ś")
    .replace(/\.T/g, "Ṭ")
    .replace(/~N/g, "Ñ")
    .replace(/,,N/g, "Ñ")
    .replace(/"N/g, "Ṅ")
    .replace(/N\.\./g, "Ṅ")
}

function fromMixThisPaliScr(paliText, targetScript = "ro") {
  /* mixed script for word click */
  // if (typeof CVT === "undefined" || !CVT.TextProcessor) {
  //   return paliText
  // }

  const sinh = CVT.TextProcessor.convertAnyToSinh(paliText)
  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[targetScript.toUpperCase()])
}

function fromToThisPaliScr2Char(paliText, fromScript = "ro", targetScript = currentScript2char) {
  // if (typeof CVT === "undefined" || !CVT.TextProcessor) {
  //   return paliText
  // }
  const sinh = CVT.TextProcessor.convertToSinh(paliText, CVT.Script[fromScript.toUpperCase()])
  if (targetScript == "si") return sinh
  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[targetScript.toUpperCase()])
}

function fromSinhToTarget(paliSinhText, targetScript = currentScript2char) {
  return CVT.TextProcessor.convertFromSinh(paliSinhText, CVT.Script[targetScript.toUpperCase()])
}

function fixBeforeConvert(html, removeBoldTag = false) {
  //// Replace </b>ṃ with ṃ</b> before script converting
  //// TODO: handle other cases

  if (removeBoldTag) {
    //// Remove all <b> and </b> tags for declension table

    html = html.replace(/<\/?b>/g, "")
  } else {
    html = html.replace(/<\/b>ṃ/g, "ṃ</b>")
  }
  return html
}

function convertPaliInElement_FromRo(element, removeBoldTag = false) {
  // console.log("converting using from ro")

  //// Skip go to page UI
  if (element.tagName === "TABLE" && element.classList.contains("tCenter")) {
    return
  }

  // fixed in sinh text, so no need if from sinh
  if (element.nodeType === Node.ELEMENT_NODE) {
    element.innerHTML = fixBeforeConvert(element.innerHTML, removeBoldTag)
  }

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() === "¶" || node.textContent.trim() === "📜") {
        return
      }
      node.textContent = fromToThisPaliScr2Char(node.textContent)
      if (element.tagName !== "BODY" && element.id !== "tocDivBox") {
        element.classList.add(currentScript2char)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      convertPaliInElement_FromRo(node)
    }
  })
}

function convertPaliInElement_FromSinh(element, removeBoldTag = false) {
  // console.log("converting using from sinh")

  //// Skip go to page UI
  if (element.tagName === "TABLE" && element.classList.contains("tCenter")) {
    return
  }
  //// fixed in sinh text, so no need if from sinh
  // if (element.nodeType === Node.ELEMENT_NODE) {
  //   element.innerHTML = fixBeforeConvert(element.innerHTML, removeBoldTag)
  // }

  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim() === "¶" || node.textContent.trim() === "📜") {
        return
      }
      node.textContent = fromSinhToTarget(node.textContent)
      if (element.tagName !== "BODY" && element.id !== "tocDivBox") {
        //// need to handle this
        element.classList.remove("si")

        element.classList.add(currentScript2char)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      convertPaliInElement_FromSinh(node)
    }
  })
}

function startOptimizedConversion() {
  convertVisibleElements()
  document.body.style.display = "block"
  setTimeout(convertRemainingElements, 0)
}

function convertVisibleElements() {
  const viewportHeight = window.innerHeight
  const elements = document.body.querySelectorAll(".si")

  for (let element of elements) {
    const rect = element.getBoundingClientRect()
    if (rect.top < viewportHeight && rect.bottom >= 0) {
      if (shouldConvertFromSinh) {
        convertPaliInElement_FromSinh(element)
      } else {
        convertPaliInElement_FromRo(element)
      }
    }
  }
}

function convertRemainingElements() {
  const elements = document.body.querySelectorAll(".si")
  let index = 0

  function convertNextBatch() {
    const endIndex = Math.min(index + 80, elements.length)
    for (; index < endIndex; index++) {
      if (!elements[index].classList.contains(currentScript2char)) {
        if (shouldConvertFromSinh) {
          convertPaliInElement_FromSinh(elements[index])
        } else {
          convertPaliInElement_FromRo(elements[index])
        }
      }
    }

    if (index < elements.length) {
      setTimeout(convertNextBatch, 0) // Schedule next batch
    } else {
      setTimeout(() => {
        const metaTags = document.getElementsByTagName("meta")
        for (let meta of metaTags) {
          if (meta.getAttribute("content") && meta.getAttribute("content").includes(originalTitle)) {
            meta.setAttribute("content", meta.getAttribute("content").replace(originalTitle, convertedTitle))
          }
        }
      }, 0)
    }
  }
  convertNextBatch()
}

function getCurrentParaIdInView() {
  const viewportHeight = window.innerHeight
  aParaIdsInFile = aParaIdsInFile ? aParaIdsInFile : document.querySelectorAll("a[id^='para']")

  if (aParaIdsInFile.length === 0) {
    return "para1"
  }

  let nearestPreviousId = aParaIdsInFile[0].id // Fallback to first paragraph
  const scrollTop = window.scrollY || document.documentElement.scrollTop // Current scroll position

  // First, check for any paragraph currently in view
  for (let anchor of aParaIdsInFile) {
    const rect = anchor.getBoundingClientRect()
    // Check if the anchor is at least partially in the viewport
    if (rect.top >= 0 && rect.top <= viewportHeight) {
      return anchor.id // Return the first paragraph ID in view
    }
    // Update nearestPreviousId if this anchor is above the scroll position
    const absoluteTop = rect.top + scrollTop
    if (absoluteTop <= scrollTop) {
      nearestPreviousId = anchor.id
    }
  }

  // If no paragraph is in view, return the nearest previous ID
  return nearestPreviousId
}

// function getTrailingDigits(str) {
//   const match = str.match(/\d+$/)
//   return match ? match[0] : ""
// }

function generateMatnButton(urlVisiting, currentFile, matnFileName, mat, currentParaId) {
  // cloudflare Pages does not include file extension
  // const needDotHTML = true
  const needDotHTML = false

  let resultURL = matnFileName

  if (needDotHTML) {
    resultURL = resultURL + ".html"
  }

  const scriptInUrl = currentFile.split(".")[0]
  if (allPaliScripts.includes(scriptInUrl)) {
    resultURL = scriptInUrl + "." + resultURL
  }

  if (urlVisiting.includes("/chapter/")) {
    resultURL = "../book/" + resultURL
  }

  currentParaId = currentParaId.split("-")[0]

  let currentParaIdHash = "#" + currentParaId
  let jumpIdOrOpenFile = `Go @: ${currentParaId}`

  if (multiOrDuplicatedParaIdFileSet.has(matnFileName)) {
    // return ""
    currentParaIdHash = ""
    jumpIdOrOpenFile = "Open @ 🌀 file"
    console.log("Scroll to paragraph ID is not available. Reason:duplicated para id in the file " + matnFileName)
  }
  // handle case like chapter/s0303a.att0.html <a id="para37-38"></a>
  resultURL = resultURL + currentParaIdHash

  // HTML
  switch (mat) {
    case "m":
      return `<a target="${matnFileName}" href="${resultURL}" class="noHover" style="text-decoration: none;">
            <button onclick="onlyHideToc()" class="pageGoButton V matn">${jumpIdOrOpenFile.replace("@", "Mūla")}</button></a>`
    case "a":
      return `<a target="${matnFileName}" href="${resultURL}" class="noHover" style="text-decoration: none;">
            <button onclick="onlyHideToc()" class="pageGoButton P matn">${jumpIdOrOpenFile.replace("@", "Aṭṭha")}</button></a>`
    case "t":
      return `<a target="${matnFileName}" href="${resultURL}" class="noHover" style="text-decoration: none;">
            <button onclick="onlyHideToc()" class="pageGoButton T matn">${jumpIdOrOpenFile.replace("@", "Ṭīkā")}</button></a>`
    default:
      console.error(`getMatnButton Error: Invalid 'mat' type received: "${mat}". Expected 'm', 'a', or 't'.`)
      return ""
  }
}

function prepareMATNButtons() {
  if (typeof MATN === "undefined") {
    // MATN is not defined
    return ""
  }

  const urlVisiting = window.location.href
  let currentFile = ""
  let matnHtml = ""
  try {
    const url = new URL(urlVisiting)
    const pathname = url.pathname
    const pathParts = pathname.split("/").filter((part) => part.length > 0)
    currentFile = pathParts.pop() || ""
  } catch (e) {
    currentFile = urlVisiting.split("/").pop().split("?")[0].split("#")[0]
    console.log("new URL is not working:", e)
  }

  let currentFileClean = currentFile.replace(".html", "").replace(".vol1", "").replace(".vol2", "").replace(/\d+$/, "")

  // strip the script name from the file name
  const scriptInUrl = currentFileClean.split(".")[0]
  if (allPaliScripts.includes(scriptInUrl)) {
    currentFileClean = currentFileClean.substring(scriptInUrl.length + 1)
  }

  if (MATN[currentFileClean]) {
    const matnData = MATN[currentFileClean]

    let buttons = ""
    let currentParaId = getCurrentParaIdInView()

    let isCanNotGoParaID = false
    const canNotGoParaIDString = `<div class="matn" style="margin-top: 8px;font-style:normal;color:grey;">🌀: Go-to-paragraph is <u>not</u> available</div>`

    if (matnData.m) {
      buttons += generateMatnButton(urlVisiting, currentFile, matnData.m, "m", currentParaId)
      if (multiOrDuplicatedParaIdFileSet.has(matnData.m)) {
        isCanNotGoParaID = true
      }
    }
    if (matnData.a) {
      buttons += generateMatnButton(urlVisiting, currentFile, matnData.a, "a", currentParaId)
      if (multiOrDuplicatedParaIdFileSet.has(matnData.a)) {
        isCanNotGoParaID = true
      }
    }
    if (matnData.t) {
      buttons += generateMatnButton(urlVisiting, currentFile, matnData.t, "t", currentParaId)
      if (multiOrDuplicatedParaIdFileSet.has(matnData.t)) {
        isCanNotGoParaID = true
      }
    }

    if (buttons) {
      matnHtml = `<div class="matnButtons" style="margin-top: 2px; margin-bottom: 8px;">${buttons}${isCanNotGoParaID ? canNotGoParaIDString : ""}</div>`
      return matnHtml
    }
  }
  return ""
}

function scrollToParagraphIdFallBack() {
  // for MATN jump previous nearest paraID
  // if the file has duplicated paraID, then remove the #paraID

  const hash = window.location.hash
  aParaIdsInFile = aParaIdsInFile ? aParaIdsInFile : document.querySelectorAll('a[id^="para"]')

  if (hash && hash.startsWith("#para")) {
    const targetParaId = hash.substring(1)
    const targetElement = document.getElementById(targetParaId)

    if (!targetElement && aParaIdsInFile.length > 0) {
      const targetNum = parseInt(targetParaId.replace("para", ""))
      let nearestPara = null
      let nearestNum = -1

      const paraArray = Array.from(aParaIdsInFile).sort((a, b) => {
        return parseInt(a.id.replace("para", "")) - parseInt(b.id.replace("para", ""))
      })

      for (let para of paraArray) {
        const paraNum = parseInt(para.id.replace("para", ""))
        if (paraNum < targetNum) {
          if (paraNum > nearestNum) {
            nearestNum = paraNum
            nearestPara = para
          }
        } else {
          break
        }
      }

      const scrollTarget = nearestPara || paraArray[0]
      if (scrollTarget) {
        setTimeout(() => {
          if (window.location) {
            // this will respect the CSS that handles notch camera devices
            // [id] { scroll-margin-top: max(50px, var(--safe-area-inset-top) + 25px)}
            window.location.assign(`#${scrollTarget.id}`)
          } else {
            // may have issue with notch camera devices
            scrollTarget.scrollIntoView({ behavior: "auto", block: "start" })
          }
        }, 100)
        // 100 ms seems to be too fast for the fonts to be loaded
        // console.log("ParaID not found. Scroll to the previous nearest paragraph:", scrollTarget.id)
      }
    } else if (targetElement) {
      // console.log("ParaID exists")
      setTimeout(() => {
        if (window.location) {
          window.location.assign(`#${targetParaId}`)
        } else {
          targetElement.scrollIntoView({ behavior: "auto", block: "start" })
        }
      }, 100)
    }
  }
}

function highlightTextNodes(element, regex, tagName = "u") {
  // Recursively process all nodes under the given element
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      if (regex.test(text)) {
        const fragment = document.createDocumentFragment()
        let lastIndex = 0
        text.replace(regex, (match, offset) => {
          // Add text before the match
          if (offset > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)))
          }
          // Add highlighted match
          const highlight = document.createElement(tagName)
          highlight.textContent = match
          fragment.appendChild(highlight)
          lastIndex = offset + match.length
        })
        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
        }
        // Replace the text node with the fragment
        node.parentNode.replaceChild(fragment, node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip script, style, or other elements where text shouldn't be modified
      if (!["SCRIPT", "STYLE"].includes(node.tagName.toUpperCase())) {
        // Process child nodes
        Array.from(node.childNodes).forEach(processNode)
      }
    }
  }

  // Start processing from the element
  Array.from(element.childNodes).forEach(processNode)
}

window.onload = function () {
  const urlVisiting = window.location.href
  if (currentScript2char !== "ro" && urlVisiting.includes("chapter/")) {
    const urlParts = urlVisiting.split("/")
    const urlFileName = urlParts.pop()
    const fewConvertedScript = ["si", "my", "hi", "thai"]
    const isConvertedURL = fewConvertedScript.some((scrip) => urlFileName.startsWith(scrip + "."))

    if (isConvertedURL && fewConvertedScript.includes(currentScript2char)) {
      if (currentScript2char === "si") {
        document.body.style.display = "block"
      }
    } else {
      //// all of the  re-direct cases are handled in the theme.js
      originalTitle = document.title
      originalTitle = originalTitle.replaceAll("&gt;", ">")
      if (shouldConvertFromSinh) {
        convertedTitle = fromSinhToTarget(originalTitle)
      } else {
        convertedTitle = fromToThisPaliScr2Char(originalTitle)
      }
      document.title = convertedTitle
      startOptimizedConversion()
    }
  }

  listenId("goParaButton", "click", handleGoToC)
  listenId("inputParaNo", "keyup", enterKeyGoToc)

  //// Auto hide TOC when clicking on a TOC <a> tag
  const tocLinks = document.getElementsByClassName("toc_a")
  if (tocLinks.length > 0) {
    Array.from(tocLinks).forEach((link) => {
      link.addEventListener("click", onlyHideToc, { passive: false })
    })
  }

  //// page go buttons
  const buttons = document.querySelectorAll(".pageGoButton")
  if (buttons.length > 0) {
    buttons.forEach((button) => {
      const inputId = button.getAttribute("input-id")
      document.getElementById(inputId).addEventListener("keyup", function (e) {
        enterKeyGoPage(e, inputId)
      })
      button.addEventListener("click", function () {
        handleGoPage(inputId)
      })
    })
  }

  document.addEventListener("click", handleClickEvent, { passive: false })

  // Handle keyword highlighting from search results
  if (urlVisiting.includes("?keywords=")) {
    const urlObj = new URL(urlVisiting)
    const keywordsParam = urlObj.searchParams.get("keywords")
    if (keywordsParam) {
      const keywords = decodeURIComponent(keywordsParam).split("|")

      // const paraId = urlObj.hash.substring(1).match(/k\d+/)?.[0] || "" // this syntax will cause issues on old devices

      const matchResult = urlObj.hash.substring(1).match(/k\d+/)
      const paraId = matchResult ? matchResult[0] : ""

      const paraElement = document.getElementById(paraId)
      if (paraElement) {
        // Prepare keywords and their regex patterns
        const keywordPatterns = keywords
          .map((keyword) => {
            if (currentScript2char !== "ro") {
              keyword = fromToThisPaliScr2Char(keyword, "ro", currentScript2char)
            }
            if (keyword && paraElement.textContent.includes(keyword)) {
              // Escape special regex characters but preserve Pāli diacritical marks
              const escapedKeyword = keyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
              return escapedKeyword
            }
            return null
          })
          .filter(Boolean)

        if (keywordPatterns.length > 0) {
          // Create a combined regex for all keywords
          const combinedPattern = keywordPatterns.map((pattern) => `(?<!\\p{L})${pattern}(?!\\p{L})`).join("|")
          const regex = new RegExp(combinedPattern, "gu")

          // Highlight all matches in a single pass
          highlightTextNodes(paraElement, regex, "u")
        }

        // Scroll to the paragraph after highlighting
        setTimeout(() => {
          paraElement.scrollIntoView({ behavior: "auto", block: "start" })
        }, 100)
      }
    }
  }

  if (window.location) {
    try {
      //// scroll to the last position where the user stopped for 3 seconds
      function saveScrollYPosition(item = "tpo_lastScrollY") {
        //// luckily scrolling inside "dictionary-res" div does not trigger a scrolling event
        //// so we do not need to handle inside "dictionary-res" scrolling
        localStorage.setItem(item, window.scrollY)
      }

      const href = window.location.href
      const hash = window.location.hash

      if (href) {
        // MAT jump fallback para id
        scrollToParagraphIdFallBack()

        // Listen for hash changes
        window.addEventListener("hashchange", scrollToParagraphIdFallBack)

        const url = new URL(href)
        const path = url.pathname.slice(1)
        const savePositionKey = `scroll_${path}`

        if (!hash) {
          // Scroll to the last position when there is no hash
          console.log("scrollY", "scroll to last position")
          let nScrollY = localStorage.getItem(savePositionKey)
          if (nScrollY) {
            window.scrollTo({
              top: Number(nScrollY),
            })
          }
        }

        let debounceTimeOut
        window.addEventListener("scroll", () => {
          clearTimeout(debounceTimeOut)
          debounceTimeOut = setTimeout(() => {
            saveScrollYPosition(savePositionKey)
          }, 3000)
        })
      }
    } catch (error) {
      console.log("scrollY error:", error)
    }
  }

  //// Also help to establish a connection to the API server
  getFeedbackTemplateFromDb(urlVisiting)
}
