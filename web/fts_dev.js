let ftsFoldAllStatus = true
// eslint-disable-next-line no-unused-vars
var ftsTotalFilesFound = 0
// eslint-disable-next-line no-unused-vars
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

let ftsAPIURL = "https://api.tipitakapali.org/api/fts"
/* CURRENTSCRIPTKEY will be replaced for each pali script */
let CURRENTSCRIPTKEY = "ro"

let insertedDarkStyle = "no"
const STORAGE_SCRIPT_KEY = "tipitakapali_org_paliScript"

// #-----
// For now disable script
// #-----
document.getElementById("buildPaliScriptMenu").style.display = "none"

if (!String.prototype.replaceAll) {
  /* simple string.replaceAll polyfill */
  /* only replace str, does not handle RegExp */
  /* @pnry */
  console.log("Native str.replaceAll is not available. Using superficial replaceAll.")
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

function preparePostOp_(postObj) {
  return {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postObj),
  }
}

function preparePostOp(postObj) {
  return {
    method: "POST",
    headers: {
      //// use this to avoid preflight
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(postObj).toString(),
  }
}

function fetchFTS() {
  let ftsInput = document.getElementById("fts_input")

  ftsInput.blur()

  let wordsMix = ftsInput.value.trim()

  if (wordsMix.length < 4) {
    alert("Please enter at least 4 chars. Velthuis scheme for typing Roman pāḷi is available.\nIt accepts all 17 pāḷi scripts input.")

    document.getElementById("fts_input").focus()
    return
  }

  let words = fromMixThisPaliScr(wordsMix, "ro")

  changeSearchButton((working = true))

  /* can use FormData(forme) on submit HERE instead */
  search_mode = getRadioNameValue("search_mode") || search_mode
  res_sort = getRadioNameValue("res_sort") || res_sort

  hit_limit = getNumberInput("hit_limit") || hit_limit

  distance_n = getNumberInput("distance_n") || distance_n
  snippet_len = getNumberInput("snippet_len") || snippet_len

  /* Max limit is coded in the server */
  let postObj = {
    search_words: words,
    search_mode,
    res_sort,
    hit_limit,
    distance_n,
    snippet_len,
    pali_scriptkey: CURRENTSCRIPTKEY,
  }

  let resultsEle = document.getElementById("fts_results")

  fetch(ftsAPIURL, preparePostOp(postObj))
    .then((res) => res.text())
    .then((htmlres) => {
      if (htmlres) {
        resultsEle.innerHTML = htmlres
        changeSearchButton((working = false))

        if (CURRENTSCRIPTKEY != "ro") {
          setTimeout(function () {
            convertFTSPaliRes(CURRENTSCRIPTKEY)
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
      changeSearchButton((working = false))
    })
}

function ftsTyping(id) {
  if (toHideShowGoBack) {
    let ftsInput = document.getElementById("fts_input")

    let matika = document.getElementsByClassName("tableContainer")
    matika[0].remove()

    let ftsSettingButton = document.getElementById("fts_setting_toggle_button")
    ftsSettingButton.style.display = ""

    let searchButtonHTML = '<br><button id="clearTextButton" onclick="clearTextFTS()"><i class="fas fa-trash-alt" style="color:red"></i> Clear Text</button> <button id="searchButton" onclick="fetchFTS()">Search <i class="fa fa-search" style="color:green"></i></button>'

    var lastFile = localStorage.getItem("tipitakapali_org_CURRENT_BOOK_KEY") || "index.html"

    const homeLink = `<p><a id="index.html" class="headtype" href="./${lastFile}"><button id="goBackButton"><i class="fas fa-undo"></i> Go back</button></a></p>`

    ftsSettingButton.insertAdjacentHTML("beforeBegin", homeLink)

    ftsInput.insertAdjacentHTML("afterEnd", searchButtonHTML)

    toHideShowGoBack = false
  }

  let t = document.getElementById(id)
  setTimeout(function () {
    /* TODO this is a workaround */
    /* bug double āā */
    t.value = ftsTypeVelthuis(t.value)
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
    toggleB.textContent = "Show All"
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
    ele.value = CURRENTSCRIPTKEY
  } catch (e) {
    console.log(`${e} \n\nError when loading last used pali script.
	Is this id ${id} changed in the UI?
	It is now removing the mising key and reloading.`)
    localStorage.removeItem(STORAGE_SCRIPT_KEY)
    window.location.reload(true)
  }
}

function listen_UserSelectScript(id) {
  document.getElementById(id).addEventListener("change", saveUserScriptRedirect, { passive: false })
}

function saveUserScriptRedirect() {
  let select = document.getElementById("uSelectScript")
  const lastSc = CURRENTSCRIPTKEY

  let svalue = select.options[select.selectedIndex].value
  svalue = svalue ? svalue : "ro"
  CURRENTSCRIPTKEY = svalue

  localStorage.setItem(STORAGE_SCRIPT_KEY, svalue)

  if (lastSc != svalue) {
    if (lastSc == "ro") {
      window.location.assign(`./${svalue}/index.html`)
    } else if (svalue == "ro") {
      window.location.assign(`../index.html`)
    } else {
      window.location.assign(`../${svalue}/index.html`)
    }
  }
}

function fromMixThisPaliScr(pali, toS = "ro") {
  /* one script (faster) to convert results */
  /* mixed script for keywords */
  const sinh = CVT.TextProcessor.convertAnyToSinh(pali)

  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[toS.toUpperCase()])
}

function fromToThisPaliScr(pali, frS = CURRENTSCRIPTKEY, toS = "ro") {
  /* from one script should be faster for the longer results */
  const sinh = CVT.TextProcessor.convertToSinh(pali, CVT.Script[frS.toUpperCase()])

  if (toS == "si") return sinh

  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[toS.toUpperCase()])
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

    et = fromToThisPaliScr(et, "ro", toScript)

    et = et.replaceAll("@@@", "<br>").replaceAll("@_@", "<u>").replaceAll("@__@", "</u>")
    e.innerHTML = et

    e.style.display = ""
  }
}

/* listen_UserSelectScript("uSelectScript"); */
load_lastUserPaliScript("uSelectScript")

listen_UserSelectScript("uSelectScript")

loadCheckIsDarkMode()
loadCheckIsAbhidhan()

let ele = document.getElementById("fts_input")
if (ele) {
  ele.addEventListener("keyup", enterKeyfetchFTS, {
    passive: false,
  })
}
