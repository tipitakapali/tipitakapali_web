var n=Object.defineProperty;var i=(t,e)=>n(t,"name",{value:e,configurable:!0});var currentScript2char=localStorage.getItem("tipitakapali_org_paliScript")||"ro",FONT_SIZE_MULTIPLIER_KEY="tipitakapali_org_fontSizeMultiplier",currentFontSizeMultiplier=localStorage.getItem(FONT_SIZE_MULTIPLIER_KEY)||"1";const scriptK3ys=["si","my","hi","thai","laos","km","beng","gurm","guja","telu","kann","mala","tham","brah","tibt","cyrl"],urlVisiting=window.location.href,isReadingBook=urlVisiting.includes("book/"),isReadingChapter=urlVisiting.includes("chapter/"),urlParts=urlVisiting.split("/"),urlFileName=urlParts.pop(),isScriptInFileName=scriptK3ys.some(t=>urlFileName.startsWith(t+"."));if(currentScript2char!=="ro"){if(isReadingBook)if(isScriptInFileName){const t=urlFileName.slice(0,urlFileName.indexOf("."));currentScript2char!==t&&(currentScript2char=t)}else{const t=urlParts.join("/")+`/${currentScript2char}.`+urlFileName;window.location.href=t}else if(isReadingChapter){const t=["si","my","hi","thai"];if(t.includes(currentScript2char))if(t.some(e=>urlFileName.startsWith(e+".")))currentScript2char=urlFileName.slice(0,urlFileName.indexOf("."));else{const e=urlParts.join("/")+`/${currentScript2char}.`+urlFileName;window.location.href=e}else if(!urlFileName.startsWith("si.")){const o=urlParts.join("/")+"/si."+urlFileName;window.location.href=o}}}else currentScript2char==="ro"&&isScriptInFileName&&(currentScript2char=urlFileName.slice(0,urlFileName.indexOf(".")));const scriptFonts={si:["UN-Abhaya","",""],my:["Pyidaungsu","",""],hi:["Noto Sans Devanagari","",""],ro:["Noto Sans","",""],thai:["THSarabunPali","2rem",""],laos:["Noto Sans Lao","",""],km:["Noto Sans Khmer","",""],beng:["Noto Sans Bengali","",""],gurm:["Noto Sans Gurmukhi","",""],guja:["Noto Sans Gujarati","",""],telu:["Noto Sans Telugu","",""],kann:["Noto Sans Kannada","",""],mala:["Noto Sans Malayalam","",""],tham:["Noto Sans Tai Tham","",""],brah:["Noto Sans Brahmi","",""],tibt:["Noto Serif Tibetan","",""],cyrl:["Noto Sans","",""]};function loadFonts(t){const e=scriptFonts[t][0],o=document.createElement("style");let a=`
        @font-face {
            font-family: "${e}";
            src: url("../web/fonts/pali/${e.replace(/\s+/g,"_")}/static/${e.replace(/\s+/g,"")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
        @font-face {
            font-family: ${e};
            src: url("../web/fonts/pali/${e.replace(/\s+/g,"_")}/static/${e.replace(/\s+/g,"")}-Bold.ttf") format("truetype");
            font-weight: bold;
            font-display: swap;
        }
    `;t=="brah"&&(console.log("brah script has no bold tff file"),a=`
        @font-face {
            font-family: "${e}";
            src: url("../web/fonts/pali/${e.replace(/\s+/g,"_")}/static/${e.replace(/\s+/g,"")}-Regular.ttf") format("truetype");
            font-weight: normal;
            font-display: swap;
        }
    `),o.textContent=a,document.head.appendChild(o)}if(i(loadFonts,"loadFonts"),currentScript2char!=="ro"&&!["si","my","hi","thai"].includes(currentScript2char)){loadFonts(currentScript2char);const t=scriptFonts[currentScript2char];document.documentElement.style.setProperty("--pali-font",t[0]),t[1]&&document.documentElement.style.setProperty("--pali-font-size",t[1]),t[2]&&document.documentElement.style.setProperty("--pali-line-height",t[2])}localStorage.getItem("tipitakapali_org_isDarkMode")=="yes"&&(document.documentElement.style.setProperty("--page-background","#1f2022"),document.documentElement.style.setProperty("--pali-color","#e8e6e3"),document.head.insertAdjacentHTML("beforeEnd","<style>.phraseword{color:yellow;}.tmmAbhidhan .definition{color:#e8e6e3;}</style>")),localStorage.getItem("tipitakapali_org_showPageMarker")=="yes"&&document.documentElement.style.setProperty("--pinfo-display","inline"),document.documentElement.style.setProperty("--font-size-multiplier",currentFontSizeMultiplier);
