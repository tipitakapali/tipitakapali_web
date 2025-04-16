const fs = require("fs")
const path = require("path")
const minify = require("html-minifier").minify

let inputDirs
// inputDirs = ["html_output/index"]
inputDirs = ["./index_html_not_min"]

const outputDir = "./"
for (const i of inputDirs) {
  minHTML(i, outputDir)
}

function minHTML(inputDir, outputDir) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Read files from input directory
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error("Error reading input directory:", err)
      return
    }

    let n = 0
    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        const filePath = path.join(inputDir, file)
        const outputPath = path.join(outputDir, file)

        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading file: ${filePath}`, err)
            return
          }

          // Minify HTML content
          const minifiedHTML = minify(data, {
            caseSensitive: true,
            decodeEntities: false,
            removeComments: true,
            removeAttributeQuotes: true,
            collapseWhitespace: true, // may cause danger
          })

          // const res = minifiedHTML.replace(/(?:\r\n|\r|\n)\s*/g, " ");

          // Write minified content to output directory
          fs.writeFile(outputPath, minifiedHTML, "utf8", (err) => {
            if (err) {
              console.error(`Error writing file: ${outputPath}`, err)
              return
            }
            n += 1
            console.log(`${n}. Minified file saved: ${outputPath}`)

            // Duplicate index.html to index_pc.html
            if (file === "index.html") {
              const duplicatePath = path.join(outputDir, "index_pc.html")
              fs.copyFile(outputPath, duplicatePath, (err) => {
                if (err) {
                  console.error(`Error duplicating file to: ${duplicatePath}`, err)
                  return
                }
                console.log(`Duplicated file saved as: ${duplicatePath}`)
              })
            }
          })
        })
      }
    })
  })
}

console.log("For js used esbuild")
