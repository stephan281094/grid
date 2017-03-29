const fs = require('fs')

// Write a file with contents.
module.exports = (path, contents) => {
  fs.writeFile(path, contents, (err) => {
    if (err) throw err

    console.log(`Wrote ${path}`)
  })
}
