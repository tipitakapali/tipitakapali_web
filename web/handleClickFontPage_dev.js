// file web/handleClickFontPage_dev.js

let ftsAPIURL = "https://api.tipitakapali.org/api/fts"
var BookExpandChapter = BookExpandChapter ? BookExpandChapter : {}
var expandSessionKey = "tipitakapali_org_EXPANDED_SESSION_KEY"
var EXPANDED_FILE_KEY = "tipitakapali_org_EXPANDED_FILE_KEY"
var currentFILE = localStorage.getItem("tipitakapali_org_CURRENT_BOOK_KEY") || "index.html"
var isPCMode = isPCMode ? isPCMode : false
const STORAGE_SCRIPT_KEY = "tipitakapali_org_paliScript"
let currentScript2char = localStorage.getItem(STORAGE_SCRIPT_KEY) || "ro"

// document.getElementById("buildPaliScriptMenu").style.display = "none"

const scriptFonts = {
  // si: ["--pali-font", "--pali-font-size", "--pali-line-height = 150%"],
  si: ["UN-Abhaya", "", ""],
  // my: ["Noto Sans Myanmar", "", ""],
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
  brah: ["Noto Sans Brahmi", "", ""], // does not have a bold variant font
  tibt: ["Noto Serif Tibetan", "", ""],
  cyrl: ["Noto Sans", "", ""],
}

function loadFonts(paliScript) {
  const fontFamily = scriptFonts[paliScript][0]
  const style = document.createElement("style")

  let textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: url("web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
        @font-face {
            font-family: ${fontFamily};
            src: url("web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Bold.ttf") format("truetype");
            font-weight: bold;
            font-display: swap;
        }
    `

  if ("brah" == paliScript) {
    //// brah has no bold font
    console.log("I can not find bold font for the brah script")

    textContent = `
        @font-face {
            font-family: "${fontFamily}";
            src: url("web/fonts/pali/${fontFamily.replace(/\s+/g, "_")}/static/${fontFamily.replace(/\s+/g, "")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
    `
  }

  style.textContent = textContent
  document.head.appendChild(style)
}

if (currentScript2char !== "ro") {
  // document.documentElement.style.setProperty("--body-display", "none")
  loadFonts(currentScript2char)
  const P = scriptFonts[currentScript2char]
  document.documentElement.style.setProperty("--pali-font", P[0])
  if (P[1]) document.documentElement.style.setProperty("--pali-font-size", P[1])
  if (P[2]) document.documentElement.style.setProperty("--pali-line-height", P[2])
}

let previousFromScript = "ro"
let insertedDarkStyle = "no"

/* fts stuff */
let ftsFoldAllStatus = true
var ftsTotalFilesFound = 0
var ftsTotalHits = 0
let toHideShowGoBack = true

/* -- FTS default settings --*/
/* val = dts, fts, sms, pfs */
let search_mode = "dts"
/* path */
let res_sort = "rank"
let hit_limit = 100
let distance_n = 10
let snippet_len = 40
/* --------------------------*/

/* CURRENTSCRIPTKEY will be replaced for each pali script */

if (!String.prototype.replaceAll) {
  /* simple string.replaceAll polyfill */
  /* only replace str, does not handle RegExp */
  /* @pnry */
  console.log("Native str.replaceAll is not available, using superficial replaceAll.")
  String.prototype.replaceAll = function (findX, repX) {
    let temp = this.split(findX)
    return temp.join(repX)
  }
}

function toggleDarkStyle() {
  if (insertedDarkStyle == "no") {
    const darkModeCSS = `<style>
        body, .tableContainer, #fts_input, .pfts {
          background:#eeeeee;
      }</style>`
    document.head.insertAdjacentHTML("beforeEnd", darkModeCSS)

    insertedDarkStyle = "yes"
  } else if (insertedDarkStyle == "yes") {
    const darkModeCSS = `<style>body,.tableContainer,#fts_input,.pfts{background: cornsilk;}
      </style>`

    document.head.insertAdjacentHTML("beforeEnd", darkModeCSS)

    insertedDarkStyle = "no"
  }
}

function saveShowPageMarker(e) {
  if (e.checked) {
    localStorage.setItem("tipitakapali_org_showPageMarker", "yes")
  } else {
    localStorage.setItem("tipitakapali_org_showPageMarker", "no")
  }
}

function saveIsDarkMode(e) {
  const themeIcon = document.getElementById("themeIcon")
  if (e.checked) {
    localStorage.setItem("tipitakapali_org_isDarkMode", "yes")
    themeIcon.innerHTML = "🌚"
    themeIcon.style.color = "black" // Set color to black for moon
  } else {
    localStorage.setItem("tipitakapali_org_isDarkMode", "no")
    themeIcon.innerHTML = "🌞"
    themeIcon.style.color = "#DAA520" // Set color to black for moon
  }
  toggleDarkStyle()
}

function loadCheckIsDarkMode() {
  let wasChecked = localStorage.getItem("tipitakapali_org_isDarkMode") || "no"
  const themeIcon = document.getElementById("themeIcon")

  if (wasChecked == "yes") {
    document.getElementById("isDarkMode").checked = true
    toggleDarkStyle()
    themeIcon.innerHTML = "🌚"
    themeIcon.style.color = "black" // Set color to black for moon
  }
}

function loadCheckShowPageMarker() {
  let wasChecked = localStorage.getItem("tipitakapali_org_showPageMarker") || "no"
  if (wasChecked == "yes") {
    document.getElementById("showPageMarker").checked = true
  }
}

function saveIsAbhidhan(e) {
  if (e.checked) {
    localStorage.setItem("tipitakapali_org_isAbhidhan", "yes")
  } else {
    localStorage.setItem("tipitakapali_org_isAbhidhan", "no")
  }
}

function loadCheckIsAbhidhan() {
  let wasChecked = localStorage.getItem("tipitakapali_org_isAbhidhan") || "yes"
  if (wasChecked == "yes") {
    document.getElementById("isAbhidhan").checked = true
  }
}

function setLocalStorageWithFileName(key, value) {
  key = currentFILE + key
  return localStorage.setItem(key, value)
}

function getLocalStorageWithFileName(key, value) {
  key = currentFILE + key
  return localStorage.getItem(key, value)
}

function sh(id) {
  if (currentScript2char != "ro") {
    const spans = document.querySelectorAll(`#${id} span`)
    for (const span of spans) {
      // console.log(previousFromScript, currentScript2char)
      span.innerHTML = fromMixThisPaliScr(span.innerHTML, currentScript2char)
      span.classList.add(currentScript2char)
    }
  }

  // var typeOfText = document.getElementById("type")
  // typeOfText.style.display = ""

  var elementID = document.getElementById(id)
  /* This syntax can deal with inline style only */
  var dplay = elementID.style.display
  if (dplay == "none") {
    elementID.style.display = ""
    localStorage.setItem(expandSessionKey, id)
  } else {
    elementID.style.display = "none"
  }

  elementID.previousElementSibling.scrollIntoView({ behavior: "auto", block: "start" })

  // if (location.pathname) {
  // location.replace(`${location.pathname}#${id}`)
  // }
}

function getAryDefault(array, index, defaultValue = "DEBUG_OUT_OUT_INDEX") {
  if (index >= 0 && index < array.length) {
    return array[index]
  } else {
    return defaultValue
  }
}

function buildBookExpandHTML(id) {
  //// start with ul
  let html = "<ul>"

  const BC = BookExpandChapter[id]

  //// book
  //// "b": ["class", "title", "para-range"]
  //// file of the entire book is the same as id
  const B = BC.b
  let bParaRange = getAryDefault(B, 2, "")
  if (bParaRange.length > 0) {
    bParaRange = "➡️" + bParaRange
  }

  let titleBook = getAryDefault(B, 1, "ERROR-No-Title")
  if (currentScript2char != "ro") {
    titleBook = fromToThisPaliScr2Char(titleBook, previousFromScript, currentScript2char)
    bParaRange = fromToThisPaliScr2Char(bParaRange, previousFromScript, currentScript2char)
  }

  //// Cloudflare page removes .html, so we do need to add .html
  //// Main book, all are ready to serve converted
  //// Chapter only si my hi thai are ready to serve.
  //// Other script use si => target script, so faster 50% compared to ro - si - target

  let prefixBook = ""
  let prefixChapter = ""
  let prefixCSSPali = ""

  if (currentScript2char !== "ro") {
    prefixCSSPali = currentScript2char
    prefixBook = currentScript2char + "."

    if (["si", "my", "hi", "thai"].includes(currentScript2char)) {
      prefixChapter = currentScript2char + "."
    } else {
      prefixChapter = "si" + "."
    }
  }

  html += `<li class="${getAryDefault(B, 0, "")} ${prefixCSSPali}"><a class="${prefixCSSPali}" href="book/${prefixBook}${id}">${titleBook}</a> ${bParaRange}</li>`

  //// chapter shortcut
  //// "c": [["chap_filename", "chap_title", "para_range"], ...]

  const chapters = BC.c

  if (chapters.length > 1) {
    //// Some anna book does not have chapters, so no need to display duplicated chapters and books
    for (const chapter of chapters) {
      let chapParaRange = getAryDefault(chapter, 2, "")
      if (chapParaRange.length > 0) {
        chapParaRange = "➡️" + chapParaRange
      }
      let titleChap = getAryDefault(chapter, 1, "ERROR-No-Chap-Title")
      if (currentScript2char != "ro") {
        titleChap = fromToThisPaliScr2Char(titleChap, previousFromScript, currentScript2char)
        chapParaRange = fromToThisPaliScr2Char(chapParaRange, previousFromScript, currentScript2char)
      }
      html += `<li class="${prefixCSSPali}"><a class="${prefixCSSPali}" href="chapter/${prefixChapter}${getAryDefault(chapter, 0, "ERROR-chap-file")}">${titleChap}</a> ${chapParaRange}</li>`
    }
  }
  // else {
  //   html += `<i style="font-size:small;">No sub-chapters</i>`
  // }

  //// end with ul
  html += "</ul>"
  return html
}

function appendSHTOC(ele) {
  let cssPre = ""
  if (currentScript2char != "ro") {
    cssPre = currentScript2char
  }
  let id = ele.getAttribute("id")
  id = id.trim().toLowerCase() // 2024 .replace(/\./g, "_");
  let str = ele.className
  if (str.indexOf("loaded") < 0) {
    ele.className = `pT loaded hide ${cssPre}`

    let apendHTML = buildBookExpandHTML(id)

    if (!apendHTML) return alert("No Toc Found!")
    ele.insertAdjacentHTML("afterend", `<div class="tdetail" style="display:;" id="hid_${id}">` + apendHTML + "<br></div>")
  } else if (str.indexOf("hide") > -1) {
    document.getElementById("hid_" + id).style.display = "none"
    ele.className = `pT loaded show ${cssPre}`
  } else if (str.indexOf("show") > -1) {
    document.getElementById("hid_" + id).style.display = ""
    ele.className = `pT loaded hide ${cssPre}`
  }
  setLocalStorageWithFileName(EXPANDED_FILE_KEY, id)
}

function getRadioNameValue(name) {
  let eles = document.getElementsByName(name)
  for (let e of eles) {
    if (e.checked) {
      return e.value
    }
  }
  return ""
}

function getNumberInput(id) {
  let ele = document.getElementById(id)
  if (isNaN(ele.value)) {
    return ""
  }
  return ele.value
}

function toggleFTSsetting() {
  let ele = document.getElementById("fts_setting")
  if (ele.hasAttribute("class")) {
    ele.removeAttribute("class")
  } else {
    ele.setAttribute("class", "hidenme")
  }
}

function openAndJumpToFtsSettings() {
  let ele = document.getElementById("fts_setting")
  ele.removeAttribute("class")
  setTimeout(() => {
    if (window.location) {
      // this will respect the CSS that handles notch camera devices
      // [id] { scroll-margin-top: max(50px, var(--safe-area-inset-top) + 25px)}
      window.location.assign(`#fts_setting`)
    } else {
      ele.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, 100)
}

function changeSearchButton(working = true) {
  let searchButton = document.getElementById("searchButton")
  if (!searchButton) {
    return ""
  }
  if (working) {
    searchButton.style.boxShadow = `0 -8px 6px -1px orange, 0 8px 6px 0 orange`
    searchButton.textContent = "😌 Working..."
  } else {
    searchButton.style = ""
    searchButton.textContent = "Search 🔍"
  }
}

function preparePostOp(postObj) {
  return {
    method: "POST",
    headers: {
      /* use URLSearchParams to avoid preflight */
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(postObj).toString(),
  }
}

function toggleAllCategories() {
  const allCat = document.getElementById("filter-all-cat").checked
  document.getElementById("filter-mula").checked = allCat
  document.getElementById("filter-attha").checked = allCat
  document.getElementById("filter-tika").checked = allCat

  // sync Anna category ↔ Annatext type:
  document.getElementById("filter-anna").checked = allCat
  document.getElementById("filter-annatext").checked = allCat

  updateFilters()
}

function toggleAllTypes() {
  const allType = document.getElementById("filter-all-type").checked
  document.getElementById("filter-vinaya").checked = allType
  document.getElementById("filter-sutta").checked = allType
  document.getElementById("filter-abhidhamma").checked = allType

  // sync Annatext type ↔ Anna category:
  document.getElementById("filter-annatext").checked = allType
  document.getElementById("filter-anna").checked = allType

  updateFilters()
}

function updateFilters() {
  const mula = document.getElementById("filter-mula")
  const attha = document.getElementById("filter-attha")
  const tika = document.getElementById("filter-tika")
  const anna = document.getElementById("filter-anna")

  // Prevent unchecking all category filters
  if (!mula.checked && !attha.checked && !tika.checked && !anna.checked) {
    mula.checked = true // Default to keeping at least one checked
  }

  const allCat = document.getElementById("filter-all-cat")
  allCat.checked = mula.checked && attha.checked && tika.checked && anna.checked

  const vinaya = document.getElementById("filter-vinaya")
  const sutta = document.getElementById("filter-sutta")
  const abhidhamma = document.getElementById("filter-abhidhamma")
  const annatext = document.getElementById("filter-annatext")

  // Prevent unchecking all type filters
  if (!vinaya.checked && !sutta.checked && !abhidhamma.checked && !annatext.checked) {
    vinaya.checked = true // Default to keeping at least one checked
  }

  const allType = document.getElementById("filter-all-type")
  allType.checked = vinaya.checked && sutta.checked && abhidhamma.checked && annatext.checked

  fetchFTS(false)
}

function updateSort() {
  res_sort = getRadioNameValue("res_sort") || res_sort
  fetchFTS(false)
}

function isChecked(id) {
  var el = document.getElementById(id)
  return el && typeof el.checked === "boolean" ? el.checked : false
}

function fetchFTS(callBySearchButton = true) {
  let ftsInput = document.getElementById("fts_input")

  // ftsInput.blur()
  let wordsMix = ftsInput.value.trim()

  if (wordsMix.length < 4) {
    if (callBySearchButton) {
      alert("Please enter at least 4 chars. Velthuis scheme for typing Roman pāḷi is available.\nIt accepts all 17 pāḷi scripts input.")
    }

    document.getElementById("fts_input").focus()
    return
  }

  let words = fromMixThisPaliScr(wordsMix, "ro")

  if (callBySearchButton) changeSearchButton(true)

  /* can use FormData(forme) on submit HERE instead */
  search_mode = getRadioNameValue("search_mode") || search_mode
  res_sort = getRadioNameValue("res_sort") || res_sort

  hit_limit = getNumberInput("hit_limit") || hit_limit

  distance_n = getNumberInput("distance_n") || distance_n
  snippet_len = getNumberInput("snippet_len") || snippet_len

  // CORS pre-flight issues
  // const filters = {
  //   isAll: document.getElementById("filter-all-cat").checked && document.getElementById("filter-all-type").checked,
  //   categories: {
  //     mula: document.getElementById("filter-mula").checked,
  //     attha: document.getElementById("filter-attha").checked,
  //     tika: document.getElementById("filter-tika").checked,
  //     anna: document.getElementById("filter-anna").checked,
  //   },
  //   types: {
  //     vinaya: document.getElementById("filter-vinaya").checked,
  //     sutta: document.getElementById("filter-sutta").checked,
  //     abhidhamma: document.getElementById("filter-abhidhamma").checked,
  //     annatext: document.getElementById("filter-annatext").checked,
  //   },
  // }

  // Flatten the filters object into individual key-value pairs
  /* Max limit is coded in the server */
  let postObj = {
    search_words: words,
    search_mode,
    res_sort,
    hit_limit,
    distance_n,
    snippet_len,
    pali_scriptkey: currentScript2char,
    /* using URLSearchParams to avoid CORS preflight*/
    isAll: isChecked("filter-all-cat") && isChecked("filter-all-type"),
    mula: isChecked("filter-mula"),
    attha: isChecked("filter-attha"),
    tika: isChecked("filter-tika"),
    vinaya: isChecked("filter-vinaya"),
    sutta: isChecked("filter-sutta"),
    abhidhamma: isChecked("filter-abhidhamma"),
    anna: isChecked("filter-anna"),
    annatext: isChecked("filter-annatext"),
  }

  let resultsEle = document.getElementById("fts_results")

  fetch(ftsAPIURL, preparePostOp(postObj))
    .then((res) => res.text())
    .then((htmlres) => {
      if (htmlres) {
        resultsEle.innerHTML = htmlres
        changeSearchButton(false)
        if (currentScript2char != "ro") {
          setTimeout(function () {
            convertFTSPaliRes(currentScript2char)
          }, 3)
        }
        /* for future dictionary: let allPftsSpan = document.querySelectorAll(".pfts span w");
        for (let e of allPftsSpan) {
          e.addEventListener("click", handleClickEvent, { passive: false });
        } */
      }
    })
    .catch((er) => {
      resultsEle.innerHTML = er
      changeSearchButton(false)
    })
}

function ftsTyping(id) {
  if (toHideShowGoBack) {
    toHideShowGoBack = false
    let ftsInput = document.getElementById("fts_input")

    const matika = document.getElementsByClassName("tableContainer")
    if (matika.length > 0) {
      matika[0].remove()
    }

    let ftsSettingButton = document.getElementById("fts_setting_toggle_button")
    ftsSettingButton.style.display = ""

    // sort and filter
    const sortandfilter = document.getElementById("sortandfilter")
    sortandfilter.style.display = ""

    var lastFile = localStorage.getItem("tipitakapali_org_CURRENT_BOOK_KEY") || "index.html"

    const goBackLink = document.getElementById("gobackFromSearchLink")
    if (goBackLink) {
      goBackLink.href = `./${lastFile}`
    }

    const buttonGroup = `
    <div style="text-align: center; margin-top: 5px;">
      <button class="smallButton" id="clearTextButton" onclick="clearTextFTS()">
        <i class="fas fa-trash-alt" style="color:red"></i> Clear Text
      </button>
      <button class="smallButton" id="searchButton" onclick="fetchFTS()">
        Search <i class="fa fa-search" style="color:green"></i>
      </button>
    </div>`

    const searchButtonHTML = `
    <div style="position: relative; width: 100%; min-height: 40px;">
      ${buttonGroup}
    </div>`

    const imgLogo = document.getElementsByClassName("namo")
    if (imgLogo.length > 0) {
      imgLogo[0].remove()
    }

    const cst_name = document.getElementById("cst_name")
    if (cst_name) {
      cst_name.remove()
      // cst_name.style.textAlign = "left"
      // cst_name.style.fontSize = "small"
      // cst_name.innerHTML = homeLink
    }

    ftsInput.insertAdjacentHTML("afterEnd", searchButtonHTML)
  }

  let t = document.getElementById(id)
  setTimeout(function () {
    /* TODO this is a workaround */
    /* bug double āā */
    t.value = ftsTypeVelthuis(t.value)
  }, 15)

  setTimeout(() => {
    fetchFTS(false)
  }, 15)
}

function clearTextFTS() {
  let ele = document.getElementById("fts_input")
  ele.value = ""
  ele.focus()
  let resultsEle = document.getElementById("fts_results")
  resultsEle.innerHTML = ""
}

function fsh(id) {
  let ele = document.getElementById("ce" + id)
  if (ele.hasAttribute("class")) {
    ele.removeAttribute("class")
  } else {
    ele.setAttribute("class", "hid")
  }
}

function ftsToggleHideAll(ftsTotalFilesFound) {
  let i = 0
  if (ftsFoldAllStatus) {
    for (; i < ftsTotalFilesFound; i++) {
      let id = "ce" + (i + 1)
      let ele = document.getElementById(id)
      ele.removeAttribute("class")
    }
    ftsFoldAllStatus = false

    let toggleB = document.getElementById("toggleButton")
    toggleB.style.background = "#fff"
    toggleB.textContent = "Collapse All"
  } else {
    for (; i < ftsTotalFilesFound; i++) {
      let id = "ce" + (i + 1)
      let ele = document.getElementById(id)
      ele.setAttribute("class", "hid")
    }
    ftsFoldAllStatus = true
    let toggleB = document.getElementById("toggleButton")
    toggleB.style.background = "#58E973"
    toggleB.textContent = "Expand All"
  }
}

function ftsTypeVelthuis(uType) {
  /* pnry 2017 */
  /* Last modified - 20 Dec 2020 */
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

function enterKeyfetchFTS(e) {
  if (e.isComposing || e.keyCode == 229) {
    return
  }
  if (e.key == "Enter" || e.keyCode == 13) {
    fetchFTS()
  }
}

/* ------ Pali Script Converter ------ */

function load_lastUserPaliScript(id) {
  try {
    let ele = document.getElementById(id)
    ele.value = currentScript2char

    if (currentScript2char != "ro") {
      convertBookCenter("ro", currentScript2char)
      // setTimeout(function () {
      //   convertBookCenter("ro", currentScript2char)
      // }, 0)
    }
  } catch (e) {
    console.log(`${e} \n\nError when loading last used pali script.
	Is this id ${id} changed in the UI?
	It is now removing the mising key and reloading.`)
    localStorage.remove(STORAGE_SCRIPT_KEY)
    window.location.reload(true)
  }
}

function listen_UserSelectScript(id) {
  document.getElementById(id).addEventListener("change", onChangeConvertMainScript, { passive: false })
}

function convertBookCenter(fromScript, targetScript) {
  const bookCenters = document.querySelectorAll(".bookCenter, .bookCenterAnna")
  if (!bookCenters) return

  const cst_name = document.querySelectorAll("#cst_name")
  cst_name.forEach((tex) => {
    tex.innerHTML = fromMixThisPaliScr(tex.innerHTML, targetScript)
    tex.classList.add(targetScript)
  })

  bookCenters.forEach((book) => {
    book.innerHTML = fromMixThisPaliScr(book.innerHTML, targetScript)
    book.classList.add(targetScript)
  })

  const textGroups = document.querySelectorAll(".textgroup")
  textGroups.forEach((tex) => {
    tex.innerHTML = fromMixThisPaliScr(tex.innerHTML, targetScript)
    tex.classList.add(targetScript)
  })

  const annaH4Groups = document.querySelectorAll("#anna_session_content h4")
  annaH4Groups.forEach((tex) => {
    tex.innerHTML = fromMixThisPaliScr(tex.innerHTML, targetScript)
    tex.classList.add(targetScript)
  })
}

function onChangeConvertMainScript() {
  let select = document.getElementById("uSelectScript")
  previousFromScript = currentScript2char

  let selectedScript = select.options[select.selectedIndex].value
  selectedScript = selectedScript ? selectedScript : "ro"

  currentScript2char = selectedScript

  localStorage.setItem(STORAGE_SCRIPT_KEY, selectedScript)
  if (previousFromScript != selectedScript) {
    window.location.reload(true)
  }
}

function fromMixThisPaliScr(paliText, targetScript = "ro") {
  /* mixed script for word click */
  if (typeof CVT === "undefined" || !CVT.TextProcessor) {
    return paliText
  }

  const sinh = CVT.TextProcessor.convertAnyToSinh(paliText)
  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[targetScript.toUpperCase()])
}

function fromToThisPaliScr2Char(paliText, fromScript = "ro", targetScript = currentScript2char) {
  if (typeof CVT === "undefined" || !CVT.TextProcessor) {
    return paliText
  }
  const sinh = CVT.TextProcessor.convertToSinh(paliText, CVT.Script[fromScript.toUpperCase()])
  if (targetScript == "si") return sinh
  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[targetScript.toUpperCase()])
}

function convertFTSPaliRes(toScript) {
  if (toScript == "ro") {
    return
  }

  let allPftsSpan = document.querySelectorAll(".pfts span w")
  for (let e of allPftsSpan) {
    let et = e.innerHTML
    /* w tags only have <u> and <br> tag */
    /* escape before converting */
    et = et.replaceAll("&gt;", ">").replaceAll("<br>", "@@@")
    et = et.replaceAll("<u>", "@_@").replaceAll("</u>", "@__@")

    et = fromToThisPaliScr2Char(et, "ro", toScript)

    et = et.replaceAll("@@@", "<br>").replaceAll("@_@", "<u>").replaceAll("@__@", "</u>")
    e.innerHTML = et
    e.classList.add(toScript)

    e.style.display = ""
  }
}

window.onload = function tocDetail() {
  if (!BookExpandChapter) {
    /* var BookExpandChapter = {}; */
    console.log('Warning: "BookExpandChapter" for this script has not been loaded (yet). Check!')
  }

  let pTs = document.getElementsByClassName("pT")
  if (pTs.length >= 1) {
    for (let ele of pTs) {
      ele.addEventListener(
        "click",
        function (e) {
          appendSHTOC(ele)
        },
        { passive: false }
      )
    }
  }

  /* Debug show all */
  /* for (let ele of pTs) { */
  /*     ele.click() */
  /* } */

  let mobileSessions = ["ab_session", "an_session", "anna_session", "di_session", "kh_session", "ma_session", "sa_session", "vi_session"]

  if (!isPCMode) {
    console.log("Now using mobile page")
    for (let id of mobileSessions) {
      let ele = document.getElementById(id)
      ele.addEventListener(
        "click",
        function (e) {
          sh(id + "_content")
        },
        { passive: false }
      )
    }
  }

  let exPandedThisSession = localStorage.getItem(expandSessionKey)

  // if (exPandedThisSession == undefined) {
  //   exPandedThisSession = "sa_session_content"
  // }

  if (exPandedThisSession) {
    setTimeout(function () {
      try {
        sh(exPandedThisSession)
      } catch (error) {
        console.log("Expand default session", error)
      }
    }, 0)
  }

  let lastExpandedId = getLocalStorageWithFileName(EXPANDED_FILE_KEY)
  if (lastExpandedId) {
    lastExpandedId = lastExpandedId.replace(/_/g, ".")
    var elements = document.querySelectorAll(`#${exPandedThisSession} ol > li > span`)
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id === lastExpandedId) {
        elements[i].click()
      }
    }
  }

  load_lastUserPaliScript("uSelectScript")

  listen_UserSelectScript("uSelectScript")

  let ele = document.getElementById("fts_input")
  if (ele) {
    ele.addEventListener("keyup", enterKeyfetchFTS, {
      passive: false,
    })
  }

  loadCheckIsDarkMode()
  loadCheckShowPageMarker()
  loadCheckIsAbhidhan()

  // Sync filter‑anna (category) ↔ filter‑annatext (type)
  const catAnna = document.getElementById("filter-anna")
  const typeAnnatext = document.getElementById("filter-annatext")

  function syncAnnaCheckboxes(e) {
    // set the opposite checkbox to match
    if (e.target === catAnna) {
      typeAnnatext.checked = catAnna.checked
    } else {
      catAnna.checked = typeAnnatext.checked
    }
    // re-run your filter logic
    updateFilters()
  }

  catAnna.addEventListener("change", syncAnnaCheckboxes, { passive: false })
  typeAnnatext.addEventListener("change", syncAnnaCheckboxes, { passive: false })
}
