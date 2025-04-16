const urlLUTE3 = new URL(window.location.href)
const wLUTE3 = urlLUTE3.searchParams.get("w")
const dLUTE3 = urlLUTE3.searchParams.get("d")

if (fetchDictDefi) fetchDictDefi(wLUTE3, dLUTE3)
