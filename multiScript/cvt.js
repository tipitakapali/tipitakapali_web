const CVT = require("./paliscriptconverter_edited_export")

function fromToThisPaliScr2Char(paliText, fromScript = "ro", targetScript = "si") {
  if (typeof CVT === "undefined" || !CVT.TextProcessor) {
    return paliText
  }
  const sinh = CVT.TextProcessor.convertToSinh(paliText, CVT.Script[fromScript.toUpperCase()])
  if (targetScript == "si") return sinh
  return CVT.TextProcessor.convertFromSinh(sinh, CVT.Script[targetScript.toUpperCase()])
}

function getLocaleNameForScript(fromScript = "si") {
  return CVT.getLocaleNameForScript(CVT.Script[fromScript.toUpperCase()])
}

module.exports = { fromToThisPaliScr2Char, getLocaleNameForScript }
